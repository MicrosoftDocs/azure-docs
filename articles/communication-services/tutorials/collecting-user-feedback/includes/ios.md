---
author: Adam Hammer
ms.author: adamhammer
ms.date: 2/22/2024
ms.topic: include
ms.service: azure-communication-services
---

### iOS Support Overview 

To integrate user feedback collection within iOS applications using the Azure Communication Services (ACS) UI Library, developers need to follow a structured approach. This process involves capturing user feedback, including error logs and user information. Once complete, this information is submitted to a server for processing. In this section, we detail the steps necessary to accomplish this task.

In this example, we're using the [Alamofire](https://github.com/Alamofire/Alamofire) library to handle sending a multi-part form, including log files, to the server.

#### Implementing the Support Form

1. **Event Handler Registration**: Begin by registering an event handler that listens for user-reported issues. This handler is crucial for capturing feedback directly from your iOS application's interface, using the ACS UI Library's capabilities.

2. **Visibility and Accessibility of the Form**: Ensure that the support form is readily accessible and visible to users within the application. The activation of the form is directly linked to the implementation of the event handler, which triggers its appearance within the UI, allowing users to report issues.

#### Capturing and Processing Support Requests

1. **Event Emission on User Action**: When a user reports an issue through the support form, the event handler captures this action. The information such as the user's description of the problem, error logs, and any call IDs should be prepared to send to the server.

2. **Data Structuring for Submission**: Organize the captured information into a structured format suitable for transmission. Prepare the data in a way that aligns with the expected format of the server endpoint that receives and processes the support request.

#### Submitting Data to the Server

1. **Asynchronous Submission**: Utilize asynchronous network calls to send the structured data to the server. This approach ensures that the application remains responsive, providing a seamless experience for the user while the data is transmitted in the background.

2. **Handling Server Responses**: Upon submission, efficiently process server responses. Receive and parse the response to confirm successful receipt of the data. Extract the support ticket link from the parsed response, which can be communicated back to the user for follow-up.

#### Feedback and Notifications to Users

1. **Immediate Acknowledgment**: Immediately acknowledge the submission of a support request within the application, providing users with confirmation that their report was received.

2. **Notification Strategy**: Implement a strategy for delivering notifications to users, especially on devices running iOS versions that support specific notification frameworks. You can use local notifications to inform users about the status of their report or providing updates as their issue is addressed.

### iOS Code Sample

This Swift code sample outlines a basic implementation for capturing user-reported issues and submitting them to a server for processing. This example shows how to construct a support event handler, including user feedback and application diagnostic information and delivery to the server. The code also includes error handling and user notification strategies to ensure a smooth user experience.

The following example is designed to be a hook to be installed within your Event Handler. 

#### Installation
```swift
let onUserReportedIssueHandler: (CallCompositeUserReportedIssue) -> Void = { issue in
    // Add a hook to this method, and provide it the Server endpoint + a result callback
    sendSupportEventToServer(server: self.issueUrl, event: issue) { success, result in
        if success {
            // Success: Convey the result link back to the user
        } else {
            // Error: Let the user know something has happened
        }
    }
}
```
#### Network Hook

```swift
import Foundation
import UIKit
import Combine
import AzureCommunicationUICalling
import Alamofire

/// Sends a support event to a server with details from a `CallCompositeUserReportedIssue`.
/// - Parameters:
///   - server: The URL of the server where the event will be sent.
///   - event: The `CallCompositeUserReportedIssue` containing details about the issue reported by the user.
///   - callback: A closure that is called when the operation is complete.
///               It provides a `Bool` indicating success or failure, and a `String`
///               containing the server's response or an error message.
func sendSupportEventToServer(server: String,
                              event: CallCompositeUserReportedIssue,
                              callback: @escaping (Bool, String) -> Void) {
    // Construct the URL for the endpoint.
    let url = "\(server)/receiveEvent" // Ensure this is replaced with the actual server URL.

    // Extract debugging information from the event.
    let debugInfo = event.debugInfo

    // Prepare the data to be sent as key-value pairs.
    let parameters: [String: String] = [
        "user_message": event.userMessage, // User's message about the issue.
        "ui_version": debugInfo.versions.callingUIVersion, // Version of the calling UI.
        "call_history": debugInfo.callHistoryRecords
            .map { $0.callIds.joined(separator: ",") }
            .joined(separator: "\n") // Call history, formatted.
    ]

    // Define the headers for the HTTP request.
    let headers: HTTPHeaders = [
        .contentType("multipart/form-data")
    ]

    // Perform the multipart/form-data upload.
    AF.upload(multipartFormData: { multipartFormData in
        // Append each parameter as a part of the form data.
        for (key, value) in parameters {
            if let data = value.data(using: .utf8) {
                multipartFormData.append(data, withName: key)
            }
        }

        // Append log files.
        debugInfo.logFiles.forEach { fileURL in
            do {
                let fileData = try Data(contentsOf: fileURL)
                multipartFormData.append(fileData,
                                         withName: "log_files",
                                         fileName: fileURL.lastPathComponent,
                                         mimeType: "application/octet-stream")
            } catch {
                print("Error reading file data: \(error)")
            }
        }
    }, to: url, method: .post, headers: headers).response { response in
        // Handle the response from the server.
        switch response.result {
        case .success(let responseData):
            // Attempt to decode the response.
            if let data = responseData, let responseString = String(data: data, encoding: .utf8) {
                callback(true, responseString) // Success case.
            } else {
                callback(false, "Failed to decode response.") // Failed to decode.
            }
        case .failure(let error):
            // Handle any errors that occurred during the request.
            print("Error sending support event: \(error)")
            callback(false, "Error sending support event: \(error.localizedDescription)")
        }
    }
}
```

This Swift code demonstrates the process of submitting user-reported issues from an iOS application using Azure Communication Services. It handles the collection of user feedback, packaging of diagnostic information, and asynchronous submission to a server endpoint. Additionally, it provides the foundation for implementing feedback mechanisms, ensuring users are informed about the status of their reports and enhancing overall application reliability and user satisfaction.
