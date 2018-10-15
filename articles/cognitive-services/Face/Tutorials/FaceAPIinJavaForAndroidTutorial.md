---
title: "Tutorial: Detect and frame faces in an image - Face API, Java for Android"
titleSuffix: Azure Cognitive Services
description: In this tutorial, you create a simple Android app that uses the Face API to detect and frame faces in an image.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: face-api
ms.topic: tutorial
ms.date: 07/12/2018
ms.author: pafarley
#Customer intent: As a developer, I want to use the client library to make calling the Face service easier.
---

# Tutorial: Create an Android app to detect and frame faces in an image

In this tutorial, you create a simple Android application that uses the Face service Java class library to detect human faces in an image. The application shows a selected image with each detected face framed by a rectangle. The complete sample code is available on GitHub at [Detect and frame faces in an image on Android](https://github.com/Azure-Samples/cognitive-services-face-android-sample).

![Android screenshot of a photo with faces framed by a red rectangle](../Images/android_getstarted2.1.PNG)

This tutorial shows you how to:

> [!div class="checklist"]
> - Create an Android application
> - Install the Face service client library
> - Use the client library to detect faces in an image
> - Draw a frame around each detected face

## Prerequisites

- You need a subscription key to run the sample. You can get free trial subscription keys from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=face-api).
- [Android Studio](https://developer.android.com/studio/) with minimum SDK 22 (required by the Face client library).
- The [com.microsoft.projectoxford:face:1.4.3](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22com.microsoft.projectoxford%22) Face client library from Maven. It isn't necessary to download the package. Installation instructions are provided below.

## Create the project

Create your Android application project by following these steps:

1. Open Android Studio. This tutorial uses Android Studio 3.1.
1. Select **Start a new Android Studio project**.
1. On the **Create Android Project** screen, modify the default fields, if necessary, then click **Next**.
1. On the **Target Android Devices** screen, use the dropdown selector to choose **API 22** or higher, then click **Next**.
1. Select **Empty Activity**, then click **Next**.
1. Uncheck **Backwards Compatibility**, then click **Finish**.

## Create the UI for selecting and displaying the image

Open *activity_main.xml*; you should see the Layout Editor. Select the **Text** tab, then replace the contents with the following code.

```xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <ImageView
        android:layout_width="match_parent"
        android:layout_height="fill_parent"
        android:id="@+id/imageView1"
        android:layout_above="@+id/button1"
        android:contentDescription="Image with faces to analyze"/>

    <Button
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Browse for face image"
        android:id="@+id/button1"
        android:layout_alignParentBottom="true"/>
</RelativeLayout>
```

Open *MainActivity.java*, then replace everything but the first `package` statement with the following code.

The code sets an event handler on the `Button` that starts a new activity to allow the user to select a picture. Once selected, the picture is displayed in the `ImageView`.

```java
import java.io.*;
import android.app.*;
import android.content.*;
import android.net.*;
import android.os.*;
import android.view.*;
import android.graphics.*;
import android.widget.*;
import android.provider.*;

public class MainActivity extends Activity {
    private final int PICK_IMAGE = 1;
    private ProgressDialog detectionProgressDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
            Button button1 = (Button)findViewById(R.id.button1);
            button1.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.setType("image/*");
                startActivityForResult(Intent.createChooser(
                        intent, "Select Picture"), PICK_IMAGE);
            }
        });

        detectionProgressDialog = new ProgressDialog(this);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_IMAGE && resultCode == RESULT_OK &&
                data != null && data.getData() != null) {
            Uri uri = data.getData();
            try {
                Bitmap bitmap = MediaStore.Images.Media.getBitmap(
                        getContentResolver(), uri);
                ImageView imageView = (ImageView) findViewById(R.id.imageView1);
                imageView.setImageBitmap(bitmap);

                // Uncomment
                //detectAndFrame(bitmap);
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }
    }
}
```

Now your app can browse for a photo and display it in the window, similar to the image below.

![Android screenshot of a photo with faces](../Images/android_getstarted1.1.PNG)

## Configure the Face client library

The Face API is a cloud API, which you can call using HTTPS requests. This tutorial uses the Face client library, which encapsulates these web requests, to simplify your work.

In the **Project** pane, use the dropdown selector to select **Android**. Expand **Gradle Scripts**, then open *build.gradle (Module: app)*.

Add a dependency for the Face client library, `com.microsoft.projectoxford:face:1.4.3`, as shown in the screenshot below, then click **Sync Now**.

![Android Studio screenshot of App build.gradle file](../Images/face-tut-java-gradle.png)

Open **MainActivity.java** and append the following import directives:

```java
import com.microsoft.projectoxford.face.*;
import com.microsoft.projectoxford.face.contract.*;
```

## Add the Face client library code

Insert the following code in the `MainActivity` class, above the `onCreate` method:

```java
private final String apiEndpoint = "<API endpoint>";
private final String subscriptionKey = "<Subscription Key>";

private final FaceServiceClient faceServiceClient =
        new FaceServiceRestClient(apiEndpoint, subscriptionKey);
```

Replace `<API endpoint>` with the API endpoint that was assigned to your key. Free trial subscription keys are generated in the **westcentralus**
region. So if you're using a free trial subscription key, the statement would be:

```java
apiEndpoint = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0";
```

Replace `<Subscription Key>` with your subscription key. For example:

```java
subscriptionKey = "0123456789abcdef0123456789ABCDEF"
```

In the **Project** pane, expand **app**, then **manifests**, and open *AndroidManifest.xml*.

Insert the following element as a direct child of the `manifest` element:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

Build your project to check for errors. Now you're ready to call the Face service.

## Upload an image to detect faces

The most straightforward way to detect faces is to call the `FaceServiceClient.detect` method. This method wraps the [Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) API method and returns an array of `Face`'s.

Each returned `Face` includes a rectangle to indicate its location, combined with a series of optional face attributes. In this example, only the face locations are required.

If an error occurs, an `AlertDialog` displays the underlying reason.

Insert the following methods into the `MainActivity` class.

```java
// Detect faces by uploading a face image.
// Frame faces after detection.
private void detectAndFrame(final Bitmap imageBitmap) {
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    imageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);
    ByteArrayInputStream inputStream =
            new ByteArrayInputStream(outputStream.toByteArray());

    AsyncTask<InputStream, String, Face[]> detectTask =
            new AsyncTask<InputStream, String, Face[]>() {
                String exceptionMessage = "";

                @Override
                protected Face[] doInBackground(InputStream... params) {
                    try {
                        publishProgress("Detecting...");
                        Face[] result = faceServiceClient.detect(
                                params[0],
                                true,         // returnFaceId
                                false,        // returnFaceLandmarks
                                null          // returnFaceAttributes:
                                /* new FaceServiceClient.FaceAttributeType[] {
                                    FaceServiceClient.FaceAttributeType.Age,
                                    FaceServiceClient.FaceAttributeType.Gender }
                                */
                        );
                        if (result == null){
                            publishProgress(
                                    "Detection Finished. Nothing detected");
                            return null;
                        }
                        publishProgress(String.format(
                                "Detection Finished. %d face(s) detected",
                                result.length));
                        return result;
                    } catch (Exception e) {
                        exceptionMessage = String.format(
                                "Detection failed: %s", e.getMessage());
                        return null;
                    }
                }

                @Override
                protected void onPreExecute() {
                    //TODO: show progress dialog
                }
                @Override
                protected void onProgressUpdate(String... progress) {
                    //TODO: update progress
                }
                @Override
                protected void onPostExecute(Face[] result) {
                    //TODO: update face frames
                }
            };

    detectTask.execute(inputStream);
}

private void showError(String message) {
    new AlertDialog.Builder(this)
    .setTitle("Error")
    .setMessage(message)
    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
        }})
    .create().show();
}
```

## Frame faces in the image

Insert the following helper method into the `MainActivity` class. This method draws a rectangle around each detected face.

```java
private static Bitmap drawFaceRectanglesOnBitmap(
        Bitmap originalBitmap, Face[] faces) {
    Bitmap bitmap = originalBitmap.copy(Bitmap.Config.ARGB_8888, true);
    Canvas canvas = new Canvas(bitmap);
    Paint paint = new Paint();
    paint.setAntiAlias(true);
    paint.setStyle(Paint.Style.STROKE);
    paint.setColor(Color.RED);
    paint.setStrokeWidth(10);
    if (faces != null) {
        for (Face face : faces) {
            FaceRectangle faceRectangle = face.faceRectangle;
            canvas.drawRect(
                    faceRectangle.left,
                    faceRectangle.top,
                    faceRectangle.left + faceRectangle.width,
                    faceRectangle.top + faceRectangle.height,
                    paint);
        }
    }
    return bitmap;
}
```

Complete the `AsyncTask` methods, indicated by the `TODO` comments, in the `detectAndFrame` method. On success, the selected image is displayed with framed faces in the `ImageView`.

```java
@Override
protected void onPreExecute() {
    detectionProgressDialog.show();
}
@Override
protected void onProgressUpdate(String... progress) {
    detectionProgressDialog.setMessage(progress[0]);
}
@Override
protected void onPostExecute(Face[] result) {
    detectionProgressDialog.dismiss();
    if(!exceptionMessage.equals("")){
        showError(exceptionMessage);
    }
    if (result == null) return;
    ImageView imageView = findViewById(R.id.imageView1);
    imageView.setImageBitmap(
            drawFaceRectanglesOnBitmap(imageBitmap, result));
    imageBitmap.recycle();
}
```

Finally, in the `onActivityResult` method, uncomment the call to the `detectAndFrame` method, as shown below.

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    if (requestCode == PICK_IMAGE && resultCode == RESULT_OK &&
                data != null && data.getData() != null) {
        Uri uri = data.getData();
        try {
            Bitmap bitmap = MediaStore.Images.Media.getBitmap(
                    getContentResolver(), uri);
            ImageView imageView = findViewById(R.id.imageView1);
            imageView.setImageBitmap(bitmap);

            // Uncomment
            detectAndFrame(bitmap);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## Run the app

Run the application and browse for an image with a face. Wait a few seconds to allow the Face service to respond. After that, you'll get a result similar to the image below:

![GettingStartAndroid](../Images/android_getstarted2.1.PNG)

## Summary

In this tutorial, you learned the basic process for using the Face service and created an application to display framed faces in an image.

## Next steps

Learn about detecting and using face landmarks.

> [!div class="nextstepaction"]
> [How to Detect Faces in an Image](../Face-API-How-to-Topics/HowtoDetectFacesinImage.md)

Explore the Face APIs used to detect faces and their attributes such as pose, gender, age, head pose, facial hair, and glasses.

> [!div class="nextstepaction"]
> [Face API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).