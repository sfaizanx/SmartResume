import React, { useRef } from "react";
import { PlaceHolderData } from "../Constant/SampleData";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { Fab, Tooltip, Zoom } from "@mui/material";
import { Print } from "@mui/icons-material";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../Constant/constant";
import { useAuth } from "../context/authContext";


const mergeObjects = (sample, actual) => {
  const result = { ...sample };
   for (const key in actual) {
    if (
      actual[key] !== "" &&
      actual[key] !== null &&
      actual[key] !== undefined
    ) {
      result[key] = actual[key];
    }
  }
  return result;
};

const Template1 = ({ formData, selectedColor }) => {
  const mergedData = {
    personalInfo: mergeObjects(
      PlaceHolderData.personalInfo,
      formData.personalInfo || {}
    ),
    education: formData.education?.length ? formData.education : PlaceHolderData.education,
    experience: formData.experience?.length ? formData.experience : [],
    skills: formData.skills?.length ? formData.skills : PlaceHolderData.skills,
    projects: formData.projects?.length ? formData.projects : [],
    languages: formData.languages?.length
      ? formData.languages
      : PlaceHolderData.languages,
  };

  const { personalInfo, education, experience, skills, projects, languages } =  mergedData;
  const {id} = useParams();
  const componentRef = useRef(null);
  const location = useLocation();
  const pathname = location.pathname;
  const {tokenVal, handleOpen} = useAuth();

  const handlePrint = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/auth/Validtoken`, {
      headers: {
        Authorization: `Bearer ${tokenVal}`, 
      },
    });

    // If the request is successful, proceed to generate PDF
    if (res.data?.success) {
      const dataUrl = await toPng(componentRef.current, { quality: 1.0 });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${personalInfo.firstName || "resume"}.pdf`);
    } else {
      toast.info("Please login to print your resume");
      handleOpen();
    }
  } catch (err) {
    // Handle token invalid or expired
    handleOpen();
    toast.info("Session Expired or Invalid please login to print your resume");
  }
};



  return (
    <div className="flex">
    <div
      ref={componentRef}
      className={`p-8 max-w-5xl mx-auto bg-white font-sans leading-relaxed`}
    >
      {/* Header */}
      <div className="my-10 mx-10">
        <header className="mb-8">
          <h1
            className="text-4xl font-bold uppercase tracking-wider"
            style={{ color: selectedColor }}
          >
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2
            className="text-xl font-semibold uppercase mt-1"
            style={{ color: selectedColor }}
          >
            {personalInfo.jobTitle}
          </h2>
          <div className="mt-5 text-gray-500">{personalInfo.jobDesc}</div>
        </header>

        <hr style={{ color: selectedColor }} />

        <div className="grid grid-cols-3 gap-8 my-10">
          {/* Left Column */}
          <div className="col-span-1 space-y-8">
            {/* Contact */}
            <section>
              <h3
                className="font-bold text-2xl uppercase fo my-3"
                style={{ color: selectedColor }}
              >
                CONTACT
              </h3>
              <div className="space-y-1 text-base text-gray-500">
                <p>{personalInfo.address}</p>
                <p>{personalInfo.phone}</p>
                <p>{personalInfo.email}</p>
                <p>{personalInfo.linkedin}</p>
                <p>{personalInfo.portfolio}</p>
              </div>
            </section>

            {/* Skills */}
            <section>
              <h3
                className="font-bold uppercase text-2xl my-3"
                style={{ color: selectedColor }}
              >
                SKILLS
              </h3>
              <ul className="space-y-1">
                {skills.map((skill, i) => (
                  <li key={i} className="text-base text-gray-500">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h2
                  className="font-bold uppercase text-2xl  my-3"
                  style={{ color: selectedColor, border: selectedColor }}
                >
                  LANGUAGES
                </h2>
                {languages.map((lang, idx) => (
                  <p className="mt-1 text-gray-500 text-base" key={idx}>
                    {lang.language.charAt(0).toUpperCase() +
                      lang.language.slice(1)}{" "}
                    – {lang.proficiency}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-8">
            {/* Experience */}
            {experience.length > 0 && (
              <section>
              <h3
                className="font-bold uppercase text-2xl my-3"
                style={{ color: selectedColor }}
              >
                EXPERIENCE
              </h3>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="text-base">
                    <div className="flex justify-between">
                      <p className="font-bold uppercase" style={{ color: selectedColor }}>
                        {exp.position} - {exp.company}
                      </p>
                      <p className="italic text-gray-500">
                        {exp.startDate} - {exp.endDate}
                      </p>
                    </div>
                    <p className="mt-1 text-gray-500">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
            )}

            {/* Education */}
            <section>
              <h3
                className="font-bold uppercase text-2xl  my-3"
                style={{ color: selectedColor }}
              >
                EDUCATION
              </h3>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-base text-gray-500">
                    <div className="flex justify-between">
                      <p className="font-semibold">
                        {edu.degree} - {edu.institution} - {edu.field}
                      </p>
                      <p className="italic">{edu.startDate}-{edu.endDate}</p>
                    </div>
                    <p className="mt-1">{edu.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h3
                  className="font-bold uppercase text-2xl my-3"
                  style={{ color: selectedColor }}
                >
                  Projects
                </h3>
                {projects.map((proj, idx) => (
                  <div className="my-5" key={idx}>
                    <div className="space-y-1 text-xs" >
                      <p className="font-semibold text-lg" style={{ color: selectedColor }}>{proj.name}</p>
                      <p className="text-gray-500 text-base">
                        {proj.description}
                      </p>
                      <p className="text-gray-500 text-base">
                        <strong className="font-bold">Tech: </strong>
                        {proj.technologies}
                      </p>
                      <p className="text-base">
                        <strong className="text-base font-bold" style={{ color: selectedColor }}>Link: </strong>
                        <a
                          href={proj.link}
                          className="text-blue-500"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {proj.link}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    {pathname === `/preview/${id}` ? (
        <div>
        <Tooltip title="Print resume" arrow TransitionComponent={Zoom}>
        <Fab color="primary" aria-label="print" onClick={handlePrint}>
          <Print />
        </Fab>
      </Tooltip>
      </div>
      ):(
        null
      )}
    </div>
  );
};

export default Template1;
