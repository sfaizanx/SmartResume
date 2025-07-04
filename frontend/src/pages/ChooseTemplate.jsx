import React, { useEffect, useState } from "react";
import ResumeTemplateOne from "../templates/Template1";
import ResumeTemplateTwo from "../templates/Template2";
import ResumeTemplateThree from "../templates/Template3";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, Modal, Typography } from "@mui/material";
import CropFreeIcon from '@mui/icons-material/CropFree';
import {sampleDataOne } from "../Constant/SampleData";
import { colorOptions } from "../Constant/color";
import RadioButtonCheckedSharpIcon from '@mui/icons-material/RadioButtonCheckedSharp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const ChooseTemplate = ({selectedColor, setSelectedColor}) => {

  const [selectedTemp, setSelectTemp] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();  
  const [previewId, setPreviewId] = useState(null);
  const [open, setOpen] = React.useState(false);

  const templates = [
  { id: 1, Component: ResumeTemplateOne, data: sampleDataOne},
  { id: 2, Component: ResumeTemplateTwo, data: sampleDataOne},
  { id: 3, Component: ResumeTemplateThree, data: sampleDataOne},
];


  const handleOpen = (id) => {
    setPreviewId(id);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (id) {
      const template = templates.find((t) => t.id.toString() === id);
      if (template) setSelectTemp(template);
    }
  }, [id]);

  const handleSelect = (id) => {
    setSelectTemp(id);
  };

  const handleStart = () => {
    if (selectedTemp) {
      navigate(
        `/aibuilder/${selectedTemp}?color=${encodeURIComponent(
          selectedColor || ""
        )}`
      );
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Compact Header */}
      <div className="mb-6 flex justify-center text-center">
        <h1 className="md:text-3xl text-xl font-bold text-gray-800">
          Select Template
        </h1>
      </div>

      {/* Minimal Color Filter - Small Size */}
      <div className="mb-6 flex justify-center text-center items-center">
        <Card
          className="flex flex-wrap gap-2 p-6 shadow-lg rounded-full"
          style={{ borderRadius: "30px" }}
        >
          <span className="text-sm text-gray-800 mr-3">Colors:</span>
          {colorOptions.map((color) => (
            <RadioButtonCheckedSharpIcon key={color.value} className="cursor-pointer xs:w-xs"
              onClick={() => setSelectedColor(color.value)}
              style={{ color: color.value }}/>
          ))}
        </Card>
      </div>

      {/* Compact Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {templates.map(({ id, Component, data }) => (
          <div
            key={id}
            className={`rounded-lg overflow-hidden transition-all duration-200 bg-white`}
          >
            {/* Resume preview scaled */}
            <div
              className={`cursor-pointer transform scale-[0.4] origin-top-left`}
              onClick={() => handleSelect(id)}
              style={{
                width: "890px", // full size
                height: "350px", // full size
              }}
            >
              
              <Component formData={data} selectedColor={selectedColor} />
            </div>

            {/* Zoom Icon */}
            <Button
              variant="text"
              onClick={() => handleOpen(id)}
              className="text-xs px-3 py-1 rounded invisible sm:visible"
              style={{ borderRadius: "25px", bottom: "30px", left: "280px" }}
            >
              <CropFreeIcon style={{ fontSize: "20px", position: "absolute" }} />
            </Button>

            {/* Select Button */}
            <div className="px-2 pb-5 flex justify-center items-center">
              <Button
                variant="text"
                onClick={() => handleSelect(id)}
                className={`text-xs px-3 py-1 rounded mt-2
        ${
          selectedTemp === id
            ? "bg-blue-500 text-white"
            : "text-gray-600"
        }`}
                style={{ fontSize: "10px"}}
              >
                {selectedTemp === id ? <CheckCircleOutlineIcon/> : <ControlPointIcon/> }
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Compact Start Button */}
      {selectedTemp && (
        <button
          onClick={handleStart}
          className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 
            text-white rounded-full p-2 shadow-md z-10 cursor-pointer"
        >
          <NavigateNextIcon />
        </button>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {previewId &&
            (() => {
              const { Component, data } = templates.find(
                (t) => t.id === previewId
              );
              return (
                <Card
                  sx={{ p: 4, boxShadow: 3, borderRadius: 2, fontSize: "14px" }}
                >
                  <Component formData={data} previewId={previewId} selectedColor={selectedColor}/>
                </Card>
              );
            })()}
        </Box>
      </Modal>
    </div>
  );
};

export default ChooseTemplate;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 0,
};
