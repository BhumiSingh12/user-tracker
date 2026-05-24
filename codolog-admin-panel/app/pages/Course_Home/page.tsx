"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

// ─── TYPES ─────────────────────────────────────────────────────────────

interface Course {
  id: number;
  name: string;
  category: string;
  price: number;
  discount: number;
  totalPrice: number;
}

interface Topic {
  id: number;
  title: string;

  date: string;
  day: string;

  time: string;

  tutorId: number;
  tutorName: string;

  liveLink: string;
}

interface Module {
  id: number;
  title: string;
  topics: Topic[];
}

// ─── MOCK COURSES ──────────────────────────────────────────────────────

const mockCourses: Course[] = [
  {
    id: 1,
    name: "React Fundamentals",
    category: "Web Development",
    price: 2999,
    discount: 10,
    totalPrice: 2699,
  },
];

const tutors = [
  {
    id: 1,
    name: "Shivam Dubey",
  },
  {
    id: 2,
    name: "Rahul Sharma",
  },
  {
    id: 3,
    name: "Priya Singh",
  },
  {
    id: 4,
    name: "Aman Verma",
  },
];

const timeOptions = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];


// ─── MODULE DATA ───────────────────────────────────────────────────────

//  ─── ICONS ─────────────────────────────────────────────────────────────

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ViewIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ─── TOP ACTION PANEL ──────────────────────────────────────────────────

function TopActionPanel({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
}) {
  const tabs = ["Home", "Add Course", "Add Category", "Draft Course"];

  return (
    <div className="flex gap-3 px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-2 px-4 rounded-lg text-[13px] font-semibold border transition-all duration-150 whitespace-nowrap ${
            activeTab === tab
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ─── COURSES TABLE ─────────────────────────────────────────────────────

function CoursesTable({ courses }: { courses: Course[] }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {[
              "Course Name",
              "Category",
              "Price",
              "Discount",
              "Total Price",
              "Action",
            ].map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase bg-gray-50 border-b"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="px-4 py-3 border-b">{course.name}</td>

              <td className="px-4 py-3 border-b">
                {course.category}
              </td>

              <td className="px-4 py-3 border-b">
                ₹{course.price}
              </td>

              <td className="px-4 py-3 border-b">
                {course.discount}%
              </td>

              <td className="px-4 py-3 border-b">
                ₹{course.totalPrice}
              </td>

              <td className="px-4 py-3 border-b">
                <div className="flex gap-2">
                <button
  onClick={() =>
    router.push(
      `/pages/Course_Home/edit/${course.id}`
    )
  }
  className="
    flex
    items-center
    gap-2
    px-4
    py-2
    rounded-xl
    bg-gradient-to-r
    from-blue-600
    to-indigo-700
    hover:from-blue-700
    hover:to-indigo-800
    text-white
    font-bold
    shadow-lg
    hover:scale-105
    transition-all
    duration-300
  "
>
  <ViewIcon />
  Open Course
</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── SCHEDULE MODULES ──────────────────────────────────────────────────
function ScheduleModules() {

  const courseId = 101;

  const API_URL = `https://your-api-link.com/api/course/${courseId}`;

  const [modules, setModules] = useState<Module[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log("API DATA:", data);
        setModules(data.modules);
      } catch (error) {
        console.log("API ERROR:", error);
      }
    };

    fetchCourseData();
  }, []);

  const getDayFromDate = (dateString: string) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return days[new Date(dateString).getDay()];
  };

  const updateTopic = (
    moduleId: number,
    topicId: number,
    field: string,
    value: string
  ) => {
    const updatedModules = modules.map((module) => {
      if (module.id === moduleId) {
        return {
          ...module,
          topics: module.topics.map((topic) => {
            if (topic.id === topicId) {
              return {
                ...topic,
                [field]: value,
              };
            }

            return topic;
          }),
        };
      }

      return module;
    });

    setModules(updatedModules);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-2 space-y-10">
      {modules.map((module, moduleIndex) => (
        <div key={module.id} className="relative">
          {/* MODULE CARD */}
          <div className="bg-[#d9d9d9] rounded-[24px] px-7 py-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">

  {/* LEFT */}
  <div>

    <div className="flex items-center gap-3 mb-3">

      <div
        className="
          bg-black
          text-white
          px-4
          py-2
          rounded-2xl
          text-sm
          font-black
          shadow-lg
        "
      >
        COURSE #{courseId}
      </div>

      <div
        className="
          bg-green-100
          text-green-700
          px-3
          py-1
          rounded-full
          text-xs
          font-bold
        "
      >
        ACTIVE
      </div>

    </div>

    <p className="text-[24px] font-black text-black leading-tight">
      Module {moduleIndex + 1}
    </p>

    <h2 className="text-[34px] font-black text-black leading-tight mt-1">
      {module.title}
    </h2>

    <p className="text-[18px] font-semibold mt-4 text-gray-700">
      {module.topics.length} Scheduled Topics
    </p>

  </div>

  {/* RIGHT */}
  <div className="flex flex-col gap-3">

    <button
      onClick={() =>
        window.location.href = `/pages/Course_Home/edit/${courseId}`
      }
      className="
        bg-gradient-to-r
        from-blue-600
        to-indigo-700
        hover:from-blue-700
        hover:to-indigo-800
        text-white
        px-6
        py-3
        rounded-2xl
        font-bold
        shadow-xl
        hover:scale-105
        transition-all
        duration-300
      "
    >
      Open Full Editor
    </button>

    <button
      onClick={() => {
        localStorage.setItem(
          `schedule-course-${courseId}`,
          JSON.stringify(modules)
        );

        alert("Course Saved Successfully");
      }}
      className="
        bg-green-600
        hover:bg-green-700
        text-white
        px-6
        py-3
        rounded-2xl
        font-bold
        shadow-lg
        transition
      "
    >
      Save Course
    </button>

  </div>

</div>
                <p className="text-[24px] font-black text-black leading-tight">
                  Module {moduleIndex + 1}
                </p>
                <h2 className="text-[30px] font-black text-black leading-tight mt-1">
                  {module.title}
                </h2>
                <p className="text-[20px] font-semibold mt-4 text-black">
                  {module.topics.length} Topics
                </p>
              </div>
            </div>
          </div>

          {/* TOPICS */}
          <div className="ml-10 mt-4 border-l-[4px] border-[#d9d9d9] pl-5 space-y-4">
            {module.topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-[#d9d9d9] rounded-[20px] p-5 relative"
              >
                {/* DOT */}
                <div className="absolute -left-[46px] top-10 w-6 h-6 bg-black rounded-full border-[5px] border-[#d9d9d9]" />

                <div className="flex justify-between gap-8">
                  <div className="flex-1">
                    <h3 className="text-[22px] font-black text-black mb-4">
                      {topic.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-5">
                 {/* DATE */}
<div>
  <label className="block text-sm font-bold mb-2 text-black">
    Date
  </label>

  <input
    type="date"
    value={topic.date}
    disabled={editingTopicId !== topic.id}
    onChange={(e) => {
      const selectedDate = e.target.value;

      setModules((prev) =>
        prev.map((m) =>
          m.id === module.id
            ? {
                ...m,
                topics: m.topics.map((t) =>
                  t.id === topic.id
                    ? {
                        ...t,
                        date: selectedDate,
                        day: getDayFromDate(selectedDate),
                      }
                    : t
                ),
              }
            : m
        )
      );
    }}
    className="
      w-full
      bg-white
      rounded-xl
      px-4
      py-3
      outline-none
      text-black
      font-medium
      disabled:bg-gray-200
    "
  />
</div>
  {/* DAY */}
                      <div>
                        <label className="block text-sm font-bold mb-2 text-black">
                          Day
                        </label>
                        <div className="
                          w-full
                          bg-gray-100
                          rounded-xl
                          px-4
                          py-2.5
                          text-black
                          font-medium
                          border
                          border-gray-200
                        ">
                          {topic.day}
                        </div>
                      </div>

                      {/* TIME */}
                      <div>
                        <label className="block text-sm font-bold mb-2 text-black">
                          Time
                        </label>
                        {editingTopicId === topic.id ? (
                          <select
                            value={topic.time}
                            onChange={(e) =>
                              updateTopic(
                                module.id,
                                topic.id,
                                "time",
                                e.target.value
                              )
                            }
                            className="
                              w-full
                              bg-white
                              rounded-xl
                              px-4
                              py-2.5
                              outline-none
                              text-black
                              font-medium
                              border
                              border-gray-300
                            "
                          >
                            {timeOptions.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="
                            w-full
                            bg-gray-100
                            rounded-xl
                            px-4
                            py-2.5
                            text-black
                            font-medium
                            border
                            border-gray-200
                          ">
                            {topic.time}
                          </div>
                        )}
                      </div>

                     
                      {/* TUTOR */}
{/* TUTOR */}
<div>
  <label className="block text-sm font-bold mb-2 text-black">
    Tutor
  </label>

  <select
    value={topic.tutorId}
    disabled={editingTopicId !== topic.id}
    onChange={(e) => {
      const selectedId = Number(e.target.value);

      const selectedTutor = tutors.find(
        (t) => t.id === selectedId
      );

      if (!selectedTutor) return;

      setModules((prev) =>
        prev.map((m) =>
          m.id === module.id
            ? {
                ...m,
                topics: m.topics.map((t) =>
                  t.id === topic.id
                    ? {
                        ...t,
                        tutorId: selectedTutor.id,
                        tutorName: selectedTutor.name,
                      }
                    : t
                ),
              }
            : m
        )
      );
    }}
    className="
      w-full
      bg-white
      rounded-xl
      px-4
      py-3
      outline-none
      text-black
      font-medium
      disabled:bg-gray-200
    "
  >
    {tutors.map((tutor) => (
      <option key={tutor.id} value={tutor.id}>
        {tutor.name}
      </option>
    ))}
  </select>
</div>
                      {/* LIVE LINK */}
                      <div className="col-span-2">
                        <label className="block text-sm font-bold mb-2 text-black">
                          Live Link
                        </label>
                        {editingTopicId === topic.id ? (
                          <input
                            type="text"
                            value={topic.liveLink}
                            onChange={(e) =>
                              updateTopic(
                                module.id,
                                topic.id,
                                "liveLink",
                                e.target.value
                              )
                            }
                            className="
                              w-full
                              bg-white
                              rounded-xl
                              px-4
                              py-2.5
                              outline-none
                              text-black
                              font-medium
                              border
                              border-gray-300
                            "
                          />
                        ) : (
                          <div className="
                            w-full
                            bg-gray-100
                            rounded-xl
                            px-4
                            py-2.5
                            text-black
                            font-medium
                            border
                            border-gray-200
                            truncate
                          ">
                            {topic.liveLink}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col justify-center gap-3">
                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        setEditingTopicId(
                          editingTopicId === topic.id ? null : topic.id
                        );
                      }}
                      className="
                        bg-black
                        text-white
                        px-4
                        py-2
                        rounded-xl
                        text-sm
                        font-bold
                        hover:bg-gray-900
                        transition
                      "
                    >
                      {editingTopicId === topic.id
                        ? "Done Editing"
                        : "Edit Schedule"}
                    </button>

                    {/* Join Live */}
                    <a
                      href={topic.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        bg-gray-800
                        hover:bg-black
                        transition
                        text-white
                        font-bold
                        px-5
                        py-3
                        rounded-xl
                        text-sm
                        text-center
                        whitespace-nowrap
                      "
                    >
                      Join Live
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CourseHome() {

  const [activeTab, setActiveTab] = useState("Home");

  const [courses] = useState<Course[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("courses");

      return saved ? JSON.parse(saved) : mockCourses;
    }

    return mockCourses;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">

      <main className="flex-1 flex flex-col overflow-hidden">

        <TopActionPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex-1 p-5 overflow-y-auto">

          {activeTab === "Home" && <ScheduleModules />}

          {activeTab === "Add Course" && (
            <PlaceholderPanel title="Add Course" />
          )}

          {activeTab === "Add Category" && (
            <PlaceholderPanel title="Add Category" />
          )}

          {activeTab === "Draft Course" && (
            <PlaceholderPanel title="Draft Courses" />
          )}

        </div>
      </main>
    </div>
  );
}


// ─── PLACEHOLDER PANEL ─────────────────────────────────────────────────

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-xl border border-gray-100 gap-3">
      <span className="text-5xl">📋</span>

      <h2 className="text-lg font-bold text-gray-900">
        {title}
      </h2>

      <p className="text-sm text-gray-400">
        This section is under construction.
      </p>

      <div className="flex bg-amber-500 p-5 rounded-2xl align-middle">
        <a
          href="/pages/create_course"
          className="flex text-sm text-black"
        >
          <button className="flex align-middle gap-2">
            <Plus />
            <p>Create New Course</p>
          </button>
        </a>
      </div>
    </div>
  );}