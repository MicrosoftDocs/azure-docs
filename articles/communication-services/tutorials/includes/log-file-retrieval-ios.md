```swift
// Call when a support request is being called
private func onSupportRequest(userMessage: String) {
    // Assuming the getSupportFiles method returns an array or similar collection.
    let supportFiles = callClient.debugInfo.getSupportFiles()
    
    // Send the files and any user message to your Ticket System            
    dispatchSupportRequestToBackend(userMessage: userMessage, supportFiles: supportFiles)
}
```