---
title: Face API C# tutorial | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: In this tutorial, you create a Windows app that uses the Cognitive Services Face service to detect and frame faces in an image.
services: cognitive-services
author: noellelacharite
manager: nolachar

ms.service: cognitive-services
ms.component: face-api
ms.topic: tutorial
ms.date: 06/29/2018
ms.author: nolachar
---

# Tutorial: Create a WPF app to detect and frame faces in an image

In this tutorial, you create a Windows Presentation Framework (WPF) application that uses the Face service. The app detects faces in an image, draws a frame around each face, and displays a description of the face on the status bar.

The Face service is a cloud API that you can invoke through HTTPS REST requests. For ease-of-use in .NET applications, a .NET client library encapsulates the Face API REST requests. In this example, you use the client library to simplify your work.

![GettingStartCSharpScreenshot](../Images/getting-started-cs-detected.png)

## Prerequisites

- An edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/).
- You need a subscription key to run the sample. You can get free trial subscription keys from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=face-api).
- The [Microsoft.Azure.CognitiveServices.Vision.Face](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.Face/1.0.2-preview) client library NuGet package. It isn't necessary to download the package. Installation instructions are provided below.

## Create the Visual Studio solution

In this step, you create a Windows WPF application project to create a basic application to select and display an image. Follow these instructions:

1. Open Visual Studio and from the **File** menu, click **New**, then **Project**.
1. Select WPF in the **New Project** dialog box.

   In Visual Studio 2015, expand **Installed** &gt; **Templates** &gt; **Visual C#** &gt; **Windows** &gt; **Classic Desktop** &gt; and select **WPF Application**.

   In Visual Studio 2017, expand **Installed** &gt; **Templates** &gt; **Visual C#** &gt; **Windows Classic Desktop** &gt; and select **WPF App (.NET Framework)**.
1. Name the application **FaceTutorial**, then click **OK**.

## Install the Face service client library

Follow these instructions to install the client library:

1. From the **Tools** menu, click , select **NuGet Package Manager**, then **Manage NuGet Packages for Solution**.
1. In the **NuGet Package Manager** window, check **Include prerelease** and select nuget.org as your **Package source**.
1. Click the **Browse** tab, and in the **Search** box type "Microsoft.Azure.CognitiveServices.Vision.Face".
1. Select **Microsoft.Azure.CognitiveServices.Vision.Face** when it displays, then click the checkbox next to your project name, and **Install**.

## Copy and paste the initial code

1. Open MainWindow.xaml, and replace the existing code with the following code to create the window UI:

    ```xml
    <Window x:Class="FaceTutorial.MainWindow"
            xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
            xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
            Title="MainWindow" Height="700" Width="960">
        <Grid x:Name="BackPanel">
            <Image x:Name="FacePhoto" Stretch="Uniform" Margin="0,0,0,50" MouseMove="FacePhoto_MouseMove" />
            <DockPanel DockPanel.Dock="Bottom">
                <Button x:Name="BrowseButton" Width="72" Height="20" VerticalAlignment="Bottom" HorizontalAlignment="Left"
                        Content="Browse..."
                        Click="BrowseButton_Click" />
                <StatusBar VerticalAlignment="Bottom">
                    <StatusBarItem>
                        <TextBlock Name="faceDescriptionStatusBar" />
                    </StatusBarItem>
                </StatusBar>
            </DockPanel>
        </Grid>
    </Window>
    ```

1. Expand MainWindow.xaml, then open MainWindow.xaml.cs, and replace the existing code with the following code:

    ```csharp
    using Microsoft.Azure.CognitiveServices.Vision.Face;
    using Microsoft.Azure.CognitiveServices.Vision.Face.Models;

    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;
    using System.Windows;
    using System.Windows.Input;
    using System.Windows.Media;
    using System.Windows.Media.Imaging;

    namespace FaceTutorial
    {
        public partial class MainWindow : Window
        {
            // Replace the first parameter with your valid subscription key.
            //
            // Replace or verify the region in the second parameter.
            //
            // You must use the same region in your REST API call as you used to obtain your subscription keys.
            // For example, if you obtained your subscription keys from the westus region, replace
            // "westcentralus" in the URI below with "westus".
            //
            // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
            // a free trial subscription key, you should not need to change this region.
            private readonly IFaceServiceClient faceServiceClient =
                new FaceServiceClient("<Subscription Key>", "https://westcentralus.api.cognitive.microsoft.com/face/v1.0");

            Face[] faces;                   // The list of detected faces.
            String[] faceDescriptions;      // The list of descriptions for the detected faces.
            double resizeFactor;            // The resize factor for the displayed image.

            public MainWindow()
            {
                InitializeComponent();
            }

            // Displays the image and calls Detect Faces.

            private void BrowseButton_Click(object sender, RoutedEventArgs e)
            {
                // Get the image file to scan from the user.
                var openDlg = new Microsoft.Win32.OpenFileDialog();

                openDlg.Filter = "JPEG Image(*.jpg)|*.jpg";
                bool? result = openDlg.ShowDialog(this);

                // Return if canceled.
                if (!(bool)result)
                {
                    return;
                }

                // Display the image file.
                string filePath = openDlg.FileName;

                Uri fileUri = new Uri(filePath);
                BitmapImage bitmapSource = new BitmapImage();

                bitmapSource.BeginInit();
                bitmapSource.CacheOption = BitmapCacheOption.None;
                bitmapSource.UriSource = fileUri;
                bitmapSource.EndInit();

                FacePhoto.Source = bitmapSource;
            }

            // Displays the face description when the mouse is over a face rectangle.

            private void FacePhoto_MouseMove(object sender, MouseEventArgs e)
            {
            }
        }
    }
    ```

1. Insert your subscription key and verify the region.

    Find this line in the MainWindow.xaml.cs file (lines 28 and 29):

    ```csharp
    private readonly IFaceServiceClient faceServiceClient =
            new FaceServiceClient("<Subscription Key>", "https://westcentralus.api.cognitive.microsoft.com/face/v1.0");
    ```

    Replace `<Subscription Key>` in the first parameter with your Face API subscription key from step 1.

    Also, check the second parameter to be sure you use the location where you obtained your subscription keys. If you obtained your subscription keys from the westus region, for example, replace "**westcentralus**" in the URI with "**westus**".

    If you received your subscription keys by using the free trial, the region for your keys is **westcentralus**, so no change is required.

Now your app can browse for a photo and display it in the window.

![GettingStartCSharpUI](../Images/getting-started-cs-ui.png)

## Upload images to detect faces

The most straightforward way to detect faces is by calling the [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) API by uploading the image file directly.
When using the client library, this can be done by using the asynchronous method `DetectAsync` of `FaceServiceClient`.
Each returned face contains a rectangle to indicate its location, combined with a series of optional face attributes.

Insert the following code in the **MainWindow** class:

```csharp
// Uploads the image file and calls Detect Faces.

private async Task<Face[]> UploadAndDetectFaces(string imageFilePath)
{
    // The list of Face attributes to return.
    IEnumerable<FaceAttributeType> faceAttributes =
        new FaceAttributeType[] { FaceAttributeType.Gender, FaceAttributeType.Age, FaceAttributeType.Smile, FaceAttributeType.Emotion, FaceAttributeType.Glasses, FaceAttributeType.Hair };

    // Call the Face API.
    try
    {
        using (Stream imageFileStream = File.OpenRead(imageFilePath))
        {
            Face[] faces = await faceServiceClient.DetectAsync(imageFileStream, returnFaceId: true, returnFaceLandmarks:false, returnFaceAttributes: faceAttributes);
            return faces;
        }
    }
    // Catch and display Face API errors.
    catch (FaceAPIException f)
    {
        MessageBox.Show(f.ErrorMessage, f.ErrorCode);
        return new Face[0];
    }
    // Catch and display all other errors.
    catch (Exception e)
    {
        MessageBox.Show(e.Message, "Error");
        return new Face[0];
    }
}
```

## Mark faces in the image

In this step, we combine all the previous steps and mark the detected faces in the image.

In **MainWindow.xaml.cs**, add the 'async' modifier to the **BrowseButton_Click** method:

```csharp
private async void BrowseButton_Click(object sender, RoutedEventArgs e)
```

Insert the following code at the end of the **BrowseButton_Click** event handler:

```csharp
// Detect any faces in the image.
Title = "Detecting...";
faces = await UploadAndDetectFaces(filePath);
Title = String.Format("Detection Finished. {0} face(s) detected", faces.Length);

if (faces.Length > 0)
{
    // Prepare to draw rectangles around the faces.
    DrawingVisual visual = new DrawingVisual();
    DrawingContext drawingContext = visual.RenderOpen();
    drawingContext.DrawImage(bitmapSource,
        new Rect(0, 0, bitmapSource.Width, bitmapSource.Height));
    double dpi = bitmapSource.DpiX;
    resizeFactor = 96 / dpi;
    faceDescriptions = new String[faces.Length];

    for (int i = 0; i < faces.Length; ++i)
    {
        Face face = faces[i];

        // Draw a rectangle on the face.
        drawingContext.DrawRectangle(
            Brushes.Transparent,
            new Pen(Brushes.Red, 2),
            new Rect(
                face.FaceRectangle.Left * resizeFactor,
                face.FaceRectangle.Top * resizeFactor,
                face.FaceRectangle.Width * resizeFactor,
                face.FaceRectangle.Height * resizeFactor
                )
        );

        // Store the face description.
        faceDescriptions[i] = FaceDescription(face);
    }

    drawingContext.Close();

    // Display the image with the rectangle around the face.
    RenderTargetBitmap faceWithRectBitmap = new RenderTargetBitmap(
        (int)(bitmapSource.PixelWidth * resizeFactor),
        (int)(bitmapSource.PixelHeight * resizeFactor),
        96,
        96,
        PixelFormats.Pbgra32);

    faceWithRectBitmap.Render(visual);
    FacePhoto.Source = faceWithRectBitmap;

    // Set the status bar text.
    faceDescriptionStatusBar.Text = "Place the mouse pointer over a face to see the face description.";
}
```

## Describe faces in the image

In this step, we examine the Face properties and generate a string to describe the face. This string displays when the mouse pointer hovers over the face rectangle.

And add this method to the **MainWindow** class to convert the face details into a string:

```csharp
// Returns a string that describes the given face.

private string FaceDescription(Face face)
{
    StringBuilder sb = new StringBuilder();

    sb.Append("Face: ");

    // Add the gender, age, and smile.
    sb.Append(face.FaceAttributes.Gender);
    sb.Append(", ");
    sb.Append(face.FaceAttributes.Age);
    sb.Append(", ");
    sb.Append(String.Format("smile {0:F1}%, ", face.FaceAttributes.Smile * 100));

    // Add the emotions. Display all emotions over 10%.
    sb.Append("Emotion: ");
    EmotionScores emotionScores = face.FaceAttributes.Emotion;
    if (emotionScores.Anger     >= 0.1f) sb.Append(String.Format("anger {0:F1}%, ",     emotionScores.Anger * 100));
    if (emotionScores.Contempt  >= 0.1f) sb.Append(String.Format("contempt {0:F1}%, ",  emotionScores.Contempt * 100));
    if (emotionScores.Disgust   >= 0.1f) sb.Append(String.Format("disgust {0:F1}%, ",   emotionScores.Disgust * 100));
    if (emotionScores.Fear      >= 0.1f) sb.Append(String.Format("fear {0:F1}%, ",      emotionScores.Fear * 100));
    if (emotionScores.Happiness >= 0.1f) sb.Append(String.Format("happiness {0:F1}%, ", emotionScores.Happiness * 100));
    if (emotionScores.Neutral   >= 0.1f) sb.Append(String.Format("neutral {0:F1}%, ",   emotionScores.Neutral * 100));
    if (emotionScores.Sadness   >= 0.1f) sb.Append(String.Format("sadness {0:F1}%, ",   emotionScores.Sadness * 100));
    if (emotionScores.Surprise  >= 0.1f) sb.Append(String.Format("surprise {0:F1}%, ",  emotionScores.Surprise * 100));

    // Add glasses.
    sb.Append(face.FaceAttributes.Glasses);
    sb.Append(", ");

    // Add hair.
    sb.Append("Hair: ");

    // Display baldness confidence if over 1%.
    if (face.FaceAttributes.Hair.Bald >= 0.01f)
        sb.Append(String.Format("bald {0:F1}% ", face.FaceAttributes.Hair.Bald * 100));

    // Display all hair color attributes over 10%.
    HairColor[] hairColors = face.FaceAttributes.Hair.HairColor;
    foreach (HairColor hairColor in hairColors)
    {
        if (hairColor.Confidence >= 0.1f)
        {
            sb.Append(hairColor.Color.ToString());
            sb.Append(String.Format(" {0:F1}% ", hairColor.Confidence * 100));
        }
    }

    // Return the built string.
    return sb.ToString();
}
```

## Display the face description

Replace the **FacePhoto_MouseMove** method with the following code:

```csharp
private void FacePhoto_MouseMove(object sender, MouseEventArgs e)
{
    // If the REST call has not completed, return from this method.
    if (faces == null)
        return;

    // Find the mouse position relative to the image.
    Point mouseXY = e.GetPosition(FacePhoto);

    ImageSource imageSource = FacePhoto.Source;
    BitmapSource bitmapSource = (BitmapSource)imageSource;

    // Scale adjustment between the actual size and displayed size.
    var scale = FacePhoto.ActualWidth / (bitmapSource.PixelWidth / resizeFactor);

    // Check if this mouse position is over a face rectangle.
    bool mouseOverFace = false;

    for (int i = 0; i < faces.Length; ++i)
    {
        FaceRectangle fr = faces[i].FaceRectangle;
        double left = fr.Left * scale;
        double top = fr.Top * scale;
        double width = fr.Width * scale;
        double height = fr.Height * scale;

        // Display the face description for this face if the mouse is over this face rectangle.
        if (mouseXY.X >= left && mouseXY.X <= left + width && mouseXY.Y >= top && mouseXY.Y <= top + height)
        {
            faceDescriptionStatusBar.Text = faceDescriptions[i];
            mouseOverFace = true;
            break;
        }
    }

    // If the mouse is not over a face rectangle.
    if (!mouseOverFace)
        faceDescriptionStatusBar.Text = "Place the mouse pointer over a face to see the face description.";
}
```

Run this application and browse for an image containing a face. Wait for a few seconds to allow the cloud API to respond. After that, you will see a red rectangle on the faces in the image. By moving the mouse over the face rectangle, the description of the face appears on the status bar:

![GettingStartCSharpScreenshot](../Images/getting-started-cs-detected.png)

## Summary

In this tutorial, you have learned the basic process for using the Face API and created an application to display face marks in images. For more information about Face API details, see the How-To and [API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

## Next steps

Explore the Face API to ...

> [!div class="nextstepaction"]
> [Face API](https://docs.microsoft.com/en-us/azure/cognitive-services/face/apireference)
