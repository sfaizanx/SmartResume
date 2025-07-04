import React, { useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { PlaceHolderData } from "../Constant/SampleData";
import { Fab, Tooltip, Zoom } from "@mui/material";
import { Print } from "@mui/icons-material";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { BASE_URL } from "../Constant/constant";


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

const ResumeTemplateTwo = ({ formData, selectedColor }) => {
  const mergedData = {
    personalInfo: mergeObjects(
      PlaceHolderData.personalInfo,
      formData.personalInfo || {}
    ),
    education: formData.education?.length
      ? formData.education
      : PlaceHolderData.education,
    experience: formData.experience?.length ? formData.experience : [],
    skills: formData.skills?.length ? formData.skills : PlaceHolderData.skills,
    projects: formData.projects?.length ? formData.projects : [],
    languages: formData.languages?.length
      ? formData.languages
      : PlaceHolderData.languages,
  };
  const { personalInfo, education, experience, skills, projects, languages } = mergedData;
  const componentRef = useRef(null);
  const location = useLocation();
  const pathname = location.pathname;
  const { id } = useParams();
  const {tokenVal, handleOpen} = useAuth();

  const handlePrint = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/auth/Validtoken`, {
      headers: {
        Authorization: `Bearer ${tokenVal}`,
      },
    });

    if (res.data?.success) {
      const node = componentRef.current;
      node.style.width = "800px";
      node.style.padding = "32px";
      node.style.background = "white";

      const dataUrl = await toPng(node, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${personalInfo.firstName || "resume"}.pdf`);

      // Reset styles after save
      node.style.width = "";
      node.style.padding = "";
      node.style.background = "";
    } else {
      toast.info("Please login to print your resume");
      handleOpen();
    }
  } catch (err) {
    toast.info("Session Expired or Invalid, please login to print your resume");
    handleOpen();
  }
};



  return (
    <div className="min-h-screen bg-white flex justify-center py-10 px-4 font-sans">
      <div ref={componentRef} className="max-w-5xl flex md:flex-row">
        {/* Left Section */}
        <div className="w-full sm:w-1/3 bg-[#f4f0fc] p-6 text-gray-800 space-y-6 ">
          <div>
            <h2
              className="text-base font-bold"
              style={{ color: selectedColor }}
            >
              CONTACT
            </h2>
            <p className="mt-2 text-xs">
              {personalInfo.phone}
              <br />
              {personalInfo.email}
              <br />
              {personalInfo.linkedIn}
              <br />
              {personalInfo.portfolio}
            </p>
          </div>

          <div>
            <h2
              className="text-xs font-bold"
              style={{ color: selectedColor }}
            >
              ADDRESS
            </h2>
            <p className="mt-2 text-xs">{personalInfo.address}</p>
          </div>

          <div>
            <h2
              className="text-base font-bold"
              style={{ color: selectedColor }}
            >
              SKILLS
            </h2>
            <ul
              className="list-disc list-inside mt-2 space-y-1 text-xs"
              key={id}
            >
              {skills.map((skill, index) => (
                <p key={index}>{skill}</p>
              ))}
            </ul>
          </div>

          {languages.length > 0 && (
            <div>
              <h2
                className="text-base font-bold"
                style={{ color: selectedColor, border: selectedColor }}
              >
                LANGUAGES
              </h2>
              {languages.map((lang, idx) => (
                <p className="mt-1 text-xs" key={idx}>
                  {lang.language.charAt(0).toUpperCase() +
                    lang.language.slice(1)}{" "}
                  – {lang.proficiency}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="w-full sm:w-2/3 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold" style={{ color: selectedColor }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <div className="text-xl" style={{ color: selectedColor }}>
              ★★★
            </div>
          </div>
          <div
            className="text-lg font-semibold tracking-widest"
            style={{ color: selectedColor }}
          >
            <h4>{personalInfo.jobTitle}</h4>
          </div>

          <div
            className="text-lg font-bold border-b pb-1"
            style={{ color: selectedColor }}
          >
            OBJECTIVE
          </div>
          <p className="mt-2">{personalInfo.jobDesc}</p>

          <div>
            {experience.length > 0 && (
              <div>
                <h2
                  className="text-lg font-bold border-b pb-1"
                  style={{ color: selectedColor, borderColor: selectedColor }}
                >
                  EXPERIENCE
                </h2>

                {experience.map((exp, idx) => (
                  <div className="mt-5 space-y-1" key={idx}>
                    <div>
                      <i className="font-semibold">
                        {exp.startDate} – {exp.endDate}
                      </i>
                      <p>{exp.company}</p>
                    </div>
                    <div>
                      <i>{exp.description}</i>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2
              className="text-lg font-bold border-b pb-1"
              style={{ color: selectedColor, borderColor: selectedColor }}
            >
              EDUCATION
            </h2>
            {education.map((edu, idx) => (
              <div className="mt-2" key={idx}>
                <i>{edu.startDate} - {edu.endDate} </i>
                <p>
                  {edu.institution} | {edu.degree}, {edu.field}
                </p>
                <i>{edu.description}</i>
              </div>
            ))}
          </div>

          {projects.length > 0 && (
            <div>
              <h2
                className="text-lg font-bold border-b pb-1"
                style={{ color: selectedColor, borderColor: selectedColor }}
              >
                PROJECTS
              </h2>
              {projects.map((proj, idx) => (
                <div className="mt-2" key={idx}>
                  <p className="font-semibold">{proj.name}</p>
                  <p>
                    <i>{proj.description}</i>
                  </p>
                  <p>
                    <strong>Tech:</strong>{" "}
                    {Array.isArray(proj.technologies)
                      ? proj.technologies.join(", ")
                      : proj.technologies}
                  </p>
                  {proj.link && (
                    <p>
                      <strong>Link:</strong>{" "}
                      <a
                        href={proj.link}
                        className="text-blue-500"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {proj.link}
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
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
      ) : null}

      
    </div>
  );
};

export default ResumeTemplateTwo;
