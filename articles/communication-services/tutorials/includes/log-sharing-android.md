# Integrating a Log Sharing Feature in an Android Application

In this tutorial, we're going to walk you through the process of integrating a log sharing feature into your Android application using the CallingSDK.

## Prerequisites

- A working integration of CallingSDK in your application.
- Access to a `CallClient` object.

## Steps

### Step 1: Update your Layout

First, we need to add a button to your layout file that users will use to initiate the log sharing process.

```xml
<Button
    android:layout_width="150dp"
    android:layout_height="wrap_content"
    android:onClick="dumpLogs"
    android:text="Dump Logs" />
```

The `android:onClick="dumpLogs"` attribute tells Android to call the `dumpLogs()` method in your Activity or Fragment when the button is clicked.

### Step 2: Define Provider Paths

We'll define the paths of the files we want to share in a new XML file named `provider_paths.xml` in the `res/xml` directory.

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <external-path name="my_logs" path="."/>
</paths>
```

### Step 3: Add a FileProvider to your Manifest

We need to add a `<provider>` inside the `<application>` tag in your `AndroidManifest.xml` file. This allows the sharing of files through a FileProvider.

```xml
<provider
    android:name="androidx.core.content.FileProvider"
    android:authorities="com.azure.android.communication.calling.testapp.provider"
    android:exported="false"
    android:grantUriPermissions="true">
    <meta-data
        android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/provider_paths"/>
</provider>
```

Note that the `android:authorities` must be unique across all apps installed on a user's device.

### Step 4: Implement the Log Sharing Method

Finally, let's define the `dumpLogs()` method. This will be triggered when the user clicks the "Dump Logs" button. It creates a ZIP file containing the logs and prepares them for sharing.

```java
public void dumpLogs(View view) {
    // Get support files
    final List<File> files = callClient.getdebugInfo().getSupportFiles();
    
    // Generate a string representation of the current date
    final String date = new SimpleDateFormat("yyMMdd", Locale.getDefault()).format(new Date());

    // Show a ProgressDialog while the ZIP is being created
    ProgressDialog progressDialog = ProgressDialog.show(view.getContext(), "Please wait", "Creating zip file...", true, false);

    // Create a single-thread executor to offload the ZIP creation to a background thread
    ExecutorService executor = Executors.newSingleThreadExecutor();
    executor.execute(() -> {
        // Define the output file
        File outputFile = new File(view.getContext().getExternalFilesDir(null), "log-files-" + date + ".zip");

        try {
            BufferedInputStream origin;
            FileOutputStream dest = new FileOutputStream(outputFile);
            ZipOutputStream out = new ZipOutputStream(new BufferedOutputStream(dest));

            byte[] data = new byte[2048];

            // Loop through each file
            for (File file : files) {
                FileInputStream fi = new FileInputStream(file);
                origin = new BufferedInputStream(fi, 2048);
                ZipEntry entry = new ZipEntry(file.getName());
                out.putNextEntry(entry);
                
                // Read data from the file and write it to the ZIP file
                int count;
                while ((count = origin.read(data, 0, 2048)) != -1)

 {
                    out.write(data, 0, count);
                }
                origin.close();
            }
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Dismiss the ProgressDialog
        progressDialog.dismiss();

        // Get the URI for the file
        Uri fileUri = FileProvider.getUriForFile(view.getContext(), view.getContext().getApplicationContext().getPackageName() + ".provider", outputFile);
        
        // Create a new sharing Intent
        Intent shareIntent = new Intent(Intent.ACTION_SEND);
        shareIntent.setType("application/zip");
        shareIntent.putExtra(Intent.EXTRA_STREAM, fileUri);
        shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION); // Necessary to allow recipient apps to read the file

        // Start the sharing Intent
        view.getContext().startActivity(Intent.createChooser(shareIntent, "Share log files"));
    });
}
```

And there you have it! You've now added a basic log sharing feature to your Android app. This feature will make it easier for users to share log files directly from your app, which can be incredibly helpful for debugging and support.