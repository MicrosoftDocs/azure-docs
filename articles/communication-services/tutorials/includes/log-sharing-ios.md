# Integration of Log Sharing Feature Using CallingSDK and SSZipArchive

In this tutorial, we'll guide you through the process of integrating a log sharing feature into an iOS application. We'll leverage the CallingSDK and use `SSZipArchive` for creating a ZIP archive of log files directly on the device. We'll also use SwiftUI to create a button that users can tap to share the logs.

## Prerequisites

Ensure that you have:

- A working integration of CallingSDK in your application.
- Access to a `CallClient` object.
- Integrated a third-party library such as `SSZipArchive` for creating ZIP archives on the device.

## Steps

### Step 1: Define Required Variables

Declare the following variables in your SwiftUI View:

```swift
@State private var isSharing = false
let zipFilePath = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("logs.zip")
```

`isSharing` is a state variable that will be used to control the visibility of the sharing sheet in SwiftUI. The `zipFilePath` is the path where the ZIP file containing the logs will be stored.

### Step 2: Add a Button to Trigger Log Sharing

Add the following SwiftUI Button in your View:

```swift
Button("Dump Logs") {
    dumpLogs()
    self.isSharing = true
}
.sheet(isPresented: $isSharing) {
    VStack {
        Text("hello")
        ShareSheet(items: [zipFilePath])
    }
}
```

In the above code, when the button is clicked, the `dumpLogs()` function is called and `isSharing` is set to `true`. This triggers the presentation of a sheet containing a `ShareSheet` populated with the ZIP file containing the logs.

### Step 3: Implement the Log Dumping Function

Next, define the `dumpLogs()` function:

```swift
func dumpLogs() {
    if let files = callClient.debugInfo.getSupportFiles() {
        let success = SSZipArchive.createZipFile(atPath: zipFilePath.path, withFilesAtPaths: files.map { $0.path })
        if success {
            DispatchQueue.main.async {
                isSharing = true
            }
        } else {
            print("Error creating ZIP archive")
        }
    }
}
```

Here, `getSupportFiles()` is called from `debugInfo` of the `CallClient` object to fetch the log files. The `SSZipArchive.createZipFile` method is then used to create a ZIP archive at `zipFilePath`. If the zipping operation succeeds, `isSharing` is set to `true` on the main thread, thus triggering the display of the sharing sheet. If an error occurs, a message is printed to the console.

## Conclusion

You have now integrated a basic log sharing feature in your iOS application. This feature enables users to easily share logs directly from the application, which can be crucial for debugging and support.

## Next Steps

This approach is very basic, and still requires a level of user interaction. To further streamline this, it is requested to create an API endpoint that is multi-part post, that can receive the files and other troubleshooting information to create a ticket, upload the logs to a Storage Blob, and link it all to the ticket.