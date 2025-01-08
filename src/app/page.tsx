"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {  List, ListItem, Button, Typography, Divider, Grid } from "@mui/material";

export default function HomePage() {
  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const [fileContent, setFileContent] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    Array.from(fileList).forEach((file) => {
      if (!file.name.endsWith(".md")) {
        alert("Please upload a valid Markdown (.md) file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newFile = { name: file.name, content };
        setFiles((prev) => [...prev, newFile]);
        if (selectedFileIndex === null) {
          setSelectedFileIndex(0);
          setFileContent(content);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleFileClick = (index: number) => {
    const file = files[index];
    if (file) {
      setSelectedFileIndex(index);
      setFileContent(file.content);
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        xs={12} sm={4} md={3}
        sx={{
          padding: 2,
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" gutterBottom>
          README Files
        </Typography>
        <Divider sx={{ marginY: 2 }} />
        <Button
          variant="contained"
          component="label"
          sx={{ textTransform: "none" }}
        >
          Upload Markdown
          <input
            type="file"
            accept=".md"
            onChange={handleFileUpload}
            hidden
            multiple
          />
        </Button>
        <List sx={{ flexGrow: 1 }}>
          {files.map((file, index) => (
            <ListItem
              key={index}
              onClick={() => handleFileClick(index)}
              sx={{
                cursor: "pointer",
                padding: 1,
                borderRadius: 1,
                marginBottom: 1,
                border: "2px solid gray",
                backgroundColor: index === selectedFileIndex ? "primary.light" : "transparent",
                "&:hover": { backgroundColor: "primary.main", color: "white" },
              }}
            >
              {file.name}
            </ListItem>
          ))}
        </List>
      
      </Grid>
      <Grid item xs={12} sm={8} md={9} sx={{ padding: 2, overflowY: "auto" }}>
        {fileContent ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{fileContent}</ReactMarkdown>
        ) : (
          <Typography variant="body1">
            Please select or upload a README file to view its content.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
