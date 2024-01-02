```csharp
// Call when a support request is being called
private void OnSupportRequest(string userMessage) 
{
    // Assuming the GetSupportFiles method returns a List or similar collection.
    IReadOnlyList<SupportFile> supportFiles = callClient.DebugDetails.SupportFiles;

    // Send the files and any user message to your Ticket System            
    DispatchSupportRequestToBackend(userMessage, supportFiles);
}
```