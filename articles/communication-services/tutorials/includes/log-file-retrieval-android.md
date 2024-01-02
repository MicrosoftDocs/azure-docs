```java
// Call when a support request is being called
private void onSupportRequest(String userMessage) {
    // Assuming the getSupportFiles method returns a List or similar collection.
    List<SupportFile> supportFiles = callClient.getdebugInfo().getSupportFiles();

    // Send the files and any user message to your Ticket System            
    dispatchSupportRequestToBackend(userMessage, supportFiles);
}
```