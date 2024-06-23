---
title: Collecting user feedback in the ACS UI library
description: Enabling the Support Form and tooling, and handling support requests
author:      ahammer # GitHub alias
ms.author:   adamhammer # Microsoft alias
ms.service: azure-communication-services
ms.topic: quickstart
ms.date:     01/08/2024
ms.subservice: calling
zone_pivot_groups: acs-programming-languages-support-kotlin-swift
---

# Collecting user feedback in the ACS UI library

## Introduction

This comprehensive guide is designed to assist developers in integrating enhanced support into the ACS UI Library, using Azure services for backend processing. The guide is divided into client-side and server-side steps for clarity and ease of implementation.

## Prerequisites

- **Azure Subscription:** You need an active Azure subscription. If you don't have one, you can create a free account at [Azure Free Account](https://azure.microsoft.com/free/).
- **Azure Communication Services Resource:** An ACS resource is required to use calling and chat functionalities. You can create one in the Azure portal.
- **Development Environment Setup:** Ensure that your development environment is set up for one or more target platforms – Android, iOS, or web.
- **Azure Storage Account:** For storing user feedback and related data securely, an Azure Storage account is necessary. 
- **Node.js and Express.js:** Basic knowledge of Node.js and Express.js is helpful for setting up the server-side application to receive and process support requests.
- **Knowledge of RESTful APIs:** Understanding how to create and consume RESTful APIs aid in deployment and configuration of both the Client and Server. 
- **Client Development Skills:** Proficiency in the development of Android or iOS applications.

Having these prerequisites in place ensures a smooth start to integrating a comprehensive user feedback system using Azure Communication Services and other Azure resources.

## What you learn

In this guide, you gain comprehensive insights into integrating user feedback mechanisms within your Azure Communication Services (ACS) applications. The focus is on enhancing customer support through the ACS UI Library, using Azure backend services for processing. By following this guide, developers learn to:

- **Implement Client-Side Feedback Capture:** Learn how to capture user feedback, error logs, and support requests directly from Android and iOS applications using the ACS UI Library.
- **Set Up a Server-Side Application:** Step-by-step instructions on setting up a Node.js application using Express.js to receive, process, and store support requests in Azure Blob Storage. This server includes handling multipart/form-data for file uploads and securely managing user data.
- **Create Support Tickets:** Understand how to generate unique support ticket numbers, store user feedback alongside relevant application data.
- **Utilize Azure Blob Storage:** Dive into how to use Azure Blob Storage for storing feedback and support request data, ensuring secure and structured data management that supports efficient retrieval and analysis.
- **Enhance Application Reliability and User Satisfaction:** Developers can quickly address and resolve user issues by implementing the strategies outlined in this guide.

## Server-Side Setup

### Setting up a Node.js application to handle support requests

**Section Objective:** The goal is to create a Node.js application using Express.js that serves as a backend to receive support requests from users. These requests may include textual feedback, error logs, screenshots, and other relevant information that can help in diagnosing and resolving user issues. The application stores this data in Azure Blob Storage for organized and secure access.

#### Framework & Tools 

- **Express.js:** A Node.js framework for building web applications and APIs. It serves as the foundation for our server setup and request handling.
- **Formidable:** A library for parsing form data, especially designed for handling multipart/form-data, which is often used for file uploads.
- **Azure Blob Storage:** A Microsoft Azure service for the storage of large amounts of unstructured data.

#### Step 1: Environment Setup

Before you begin, ensure your development environment is ready with Node.js installed. You also need access to an Azure Storage account to store the submitted data.

1. **Install Node.js:** Make sure Node.js is installed on your system. You can download it from [Node.js](https://nodejs.org/).

2. **Create an Azure Blob Storage Account:** If you haven't already, create an Azure Storage account through the Azure portal. This account is used to store the support request data.

3. **Gather Necessary Credentials:** Ensure you have the connection string for your Azure Blob Storage account.

#### Step 2: Application Setup

1. **Initialize a New Node.js Project:**
   - Create a new directory for your project and initialize it with `npm init` to create a `package.json` file.
   - Install Express.js, Formidable, the Azure Storage Blob SDK, and other necessary libraries using npm.

     ```bash
     npm install express formidable @azure/storage-blob uuid
     ```

2. **Server Implementation:**
   - Use Express.js to set up a basic web server that listens for POST requests on a specific endpoint.
   - Use Formidable for parsing incoming form data, handling multipart/form-data content.
   - Generate a unique ticket number for each support request, which can be used to organize data in Azure Blob Storage and provide a reference for users.
   - Store structured data, such as user messages and log file metadata, in a JSON file within the Blob Storage. Store actual log files and any screenshots or attachments in separate blobs within the same ticket's directory.
   - Provide an endpoint to retrieve support details, which involve fetching and displaying data from Azure Blob Storage.

3. **Security Considerations:**
   - Ensure that your application validates the incoming data to protect against malicious payloads.
   - Use environment variables to securely store sensitive information such as your Azure Storage connection string.

#### Step 3: Running and Testing the Application

1. **Environment Variables:**
   - Set up environment variables for your Azure Blob Storage connection string and any other sensitive information. For example, you can use a `.env` file (and the `dotenv` npm package for loading these variables).

2. **Running the Server:**
   - Start your Node.js application by running `node <filename>.js`, where `<filename>` is the name of your main server file.
   - Validate the server with a suitable tool for web development.

#### Server Code:
Provided here's a working implementation to start with. This code is a basic implementation tailored to demonstrate ticket creation from the ACS UI Sample applications. 

```javascript
const express = require('express');
const formidable = require('formidable');
const fs = require('fs').promises
const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const app = express();
const connectionString = process.env.SupportTicketStorageConnectionString
const port = process.env.PORT || 3000;
const portPostfix = (!process.env.PORT || port === 3000 || port === 80 || port === 443) ? '' : `:${port}`;

app.use(express.json());

app.all('/receiveEvent', async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).send("Error processing request: " + err.message);
            }
            // Generate a unique ticket number
            const ticketNumber = uuidv4();
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient('supporttickets');
            await containerClient.createIfNotExists();

            // Prepare and upload support data
            const supportData = {
                userMessage: fields.user_message,
                uiVersion: fields.ui_version,
                sdkVersion: fields.sdk_version,
                callHistory: fields.call_history
            };
            const supportDataBlobClient = containerClient.getBlockBlobClient(`${ticketNumber}/supportdata.json`);
            await supportDataBlobClient.upload(JSON.stringify(supportData), Buffer.byteLength(JSON.stringify(supportData)));

            // Upload log files
            Object.values(files).forEach(async (fileOrFiles) => {
                // Check if the fileOrFiles is an array (multiple files) or a single file object
                const fileList = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
            
                for (let file of fileList) {
                    const blobClient = containerClient.getBlockBlobClient(`${ticketNumber}/logs/${file.originalFilename}`);
                    
                    // Read the file content into a buffer
                    const fileContent = await fs.readFile(file.filepath);
                    
                    // Now upload the buffer
                    await blobClient.uploadData(fileContent); // Upload the buffer instead of the file path
                }
            });
            // Return the ticket URL
            const endpointUrl = `${req.protocol}://${req.headers.host}${portPostfix}/ticketDetails?id=${ticketNumber}`;
            res.send(endpointUrl);
        });
    } catch (err) {
        res.status(500).send("Error processing request: " + err.message);
    }
});

// ticketDetails endpoint to serve details page
app.get('/ticketDetails', async (req, res) => {
    const ticketNumber = req.query.id;
    if (!ticketNumber) {
        return res.status(400).send("Ticket number is required");
    }

    // Fetch the support data JSON blob to display its contents
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient('supporttickets');
        const blobClient = containerClient.getBlobClient(`${ticketNumber}/supportdata.json`);
        const downloadBlockBlobResponse = await blobClient.download(0);
        const downloadedContent = (await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)).toString();
        const supportData = JSON.parse(downloadedContent);

        // Generate links for log files
        let logFileLinks = `<h3>Log Files:</h3>`;
        const listBlobs = containerClient.listBlobsFlat({ prefix: `${ticketNumber}/logs/` });
        for await (const blob of listBlobs) {
            logFileLinks += `<a href="/getLogFile?id=${ticketNumber}&file=${encodeURIComponent(blob.name.split('/')[2])}">${blob.name.split('/')[2]}</a><br>`;
        }

        // Send a simple HTML page with support data and links to log files
        res.send(`
            <h1>Ticket Details</h1>
            <p><strong>User Message:</strong> ${supportData.userMessage}</p>
            <p><strong>UI Version:</strong> ${supportData.uiVersion}</p>
            <p><strong>SDK Version:</strong> ${supportData.sdkVersion}</p>
            <p><strong>Call History:</strong> </p> <pre>${supportData.callHistory}</pre>
            ${logFileLinks}
        `);
    } catch (err) {
        res.status(500).send("Error fetching ticket details: " + err.message);
    }
});

// getLogFile endpoint to allow downloading of log files
app.get('/getLogFile', async (req, res) => {
    const { id: ticketNumber, file } = req.query;
    if (!ticketNumber || !file) {
        return res.status(400).send("Ticket number and file name are required");
    }

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient('supporttickets');
        const blobClient = containerClient.getBlobClient(`${ticketNumber}/logs/${file}`);

        // Stream the blob to the response
        const downloadBlockBlobResponse = await blobClient.download(0);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=${file}`);
        downloadBlockBlobResponse.readableStreamBody.pipe(res);
    } catch (err) {
        res.status(500).send("Error downloading file: " + err.message);
    }
});

// Helper function to stream blob content to a buffer
async function streamToBuffer(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

## Client Side Setup 

This section covers the client side setup, and how to achieve the following goals:

1. Register for user reported issues.
1. Serialize the data.
1. Forward it to the server.
1. Receive a response.
1. Present the response to the user.

::: zone pivot="programming-language-kotlin"
[!INCLUDE [Android](./includes/android.md)]
::: zone-end

::: zone pivot="programming-language-swift"
[!INCLUDE [iOS](./includes/ios.md)]
::: zone-end


## Conclusion
Integrating user feedback mechanisms into applications using Azure Communication Services (ACS) is crucial for developing responsive and user-focused apps. This guide provides a clear pathway for setting up both server-side processing with Node.js and client-side feedback capture for Android and iOS applications. Through such integration, developers can enhance application reliability and user satisfaction while utilizing Azure's cloud services for efficient data management.

The guide outlines practical steps for capturing user feedback, error logs, and support requests directly from applications. Integration of support events ensures a secure and organized way to handle feedback, allowing developers to quickly address and resolve user issues, leading to an improved overall user experience.

By following the instructions detailed in this guide, developers can improve the responsiveness of their applications and better meet user needs. These integrations not only help in understanding user feedback more effectively but also utilizes cloud services to ensure a smooth and effective feedback collection and processing mechanism. Ultimately, integrating user feedback mechanisms is essential for creating engaging and reliable applications that prioritize user satisfaction.