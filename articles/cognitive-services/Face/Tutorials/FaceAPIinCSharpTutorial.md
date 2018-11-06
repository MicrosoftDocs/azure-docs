---
title: "Tutorial: detect and analyze faces in an image using the .NET SDK"
titleSuffix: Azure Cognitive Services
description: In this tutorial, you will create a Windows app that uses the Face API to detect and frame faces in an image.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: face-api
ms.topic: tutorial
ms.date: 11/5/2018
ms.author: pafarley
#Customer intent: As a developer of image management software, I want to learn how to retrieve and manipulate face data so that I can use it for my own features and needs.
---

# Tutorial: Create a WPF app to detect and analyze faces in an image

In this tutorial, you will learn how to use the Face API service, through the .NET client SDK, to acquire face references from an image and then use those references in several ways. You'll create a simple Windows Presentation Framework (WPF) application that detects faces, draws a frame around each face, and displays a description of the face in the status bar. The complete sample code is available in the [Cognitive Face CSharp sample](https://github.com/Azure-Samples/Cognitive-Face-CSharp-sample) repository on GitHub.

This tutorial shows you how to:

> [!div class="checklist"]
> - Create a WPF application
> - Install the Face service client library
> - Use the client library to detect faces in an image
> - Draw a frame around each detected face
> - Display a description of the highlighted face on the status bar

![Screenshot showing detected faces framed with rectangles](../Images/getting-started-cs-detected.png)


## Prerequisites

- A Face API subscription key. You can get a free trial subscription key from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=face-api). Or, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to the Face API service and get your key.
- Any edition of [Visual Studio 2015 or 2017](https://www.visualstudio.com/downloads/).

## Create the Visual Studio solution

Follow these steps to create a new WPF application project.

1. In Visual Studio, open the New Project dialog.
    - If you're using Visual Studio 2017, expand **Installed**, then **Visual C#**, then select **WPF App (.NET Framework)**.
    - If you're using Visual Studio 2015, expand **Installed**, then **Templates**. Select **Visual C#**, then **WPF Application**.
1. Name the application **FaceTutorial**, then click **OK**.
1. Get the required NuGet packages. Right-click on your project in the Solution Explorer and select **Manage NuGet Packages**; then, find and install the following package:
    - Microsoft.Azure.CognitiveServices.Vision.Face 2.2.0-preview

## Add the initial code

In this section, you will add the basic framework of the app without its face-specific features.

### Create the UI

Open *MainWindow.xaml* and replace the contents with the following code&mdash;this creates the UI window. Note the event handlers, `FacePhoto_MouseMove` and `BrowseButton_Click`.

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

### Create the main class

Open *MainWindow.xaml.cs* and replace its contents with the following code. Ignore the error flags; they'll disappear after the first build.

Import the client library namespaces, along with other necessary namespaces. 

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
```

Next, insert the following stub code for a **MainWindow** class. This creates a **FaceClient** instance using the subscription key, which you must enter yourself. You must also set the region string in `faceEndpoint` to the correct region for your subscription. Note that free trial subscriptions always correspond to the "westcentralus" region. 

The two methods, **BrowseButton_Click** and **FacePhoto_MouseMove**, correspond to the event handlers declared in *MainWindow.xaml*. The **BrowseButton_Click** method creates an **OpenFileDialog**, which allows the user to select a .jpg image. It then displays the image in the main window. You will insert the remaining code for **BrowseButton_Click** and **FacePhoto_MouseMove** in later steps.

Also note the `faceList` reference&mdash;a list of **DetectedFace** objects. This is where your app will store and call the actual face data.

```csharp
namespace FaceTutorial
{
    public partial class MainWindow : Window
    {
        // Replace <SubscriptionKey> with your valid subscription key.
        private const string subscriptionKey = "<SubscriptionKey>";

        // Replace or verify the region.
        //
        // You must use the same region as you used to obtain your subscription
        // keys. For example, if you obtained your subscription keys from the
        // westus region, replace "westcentralus" with "westus".
        private const string faceEndpoint =
            "https://westcentralus.api.cognitive.microsoft.com";

        private readonly IFaceClient faceClient = new FaceClient(
            new ApiKeyServiceClientCredentials(subscriptionKey),
            new System.Net.Http.DelegatingHandler[] { });

        IList<DetectedFace> faceList;   // The list of detected faces.
        String[] faceDescriptions;      // The list of descriptions for the detected faces.
        double resizeFactor;            // The resize factor for the displayed image.

        public MainWindow()
        {
            InitializeComponent();

            if (Uri.IsWellFormedUriString(faceEndpoint, UriKind.Absolute))
            {
                faceClient.Endpoint = faceEndpoint;
            }
            else
            {
                MessageBox.Show(faceEndpoint,
                    "Invalid URI", MessageBoxButton.OK, MessageBoxImage.Error);
                Environment.Exit(0);
            }
        }

        // Displays the image and calls UploadAndDetectFaces.
        private async void BrowseButton_Click(object sender, RoutedEventArgs e)
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

### Try the app

Press **Start** on the menu to test your app. When the window opens, click **Browse** in the lower left corner. A **File Open** dialog appears where you can browse and select a photo, which is then displayed in the window. Verify that this works as expected before moving on to the next step.

![Screenshot showing unmodified image of faces](../Images/getting-started-cs-ui.png)

## Upload an image to detect faces

The most straightforward way to detect faces is to call the **FaceClient.Face.DetectWithStreamAsync** method, which wraps the [Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) REST API for uploading a local image.

Insert the following method in the **MainWindow** class, below the **FacePhoto_MouseMove** method. This defines a list of face attributes to analyze and reads the submitted image file into a **Stream**. Then it passes both of these objects to the **DetectWithStreamAsync** method call.

```csharp
// Uploads the image file and calls DetectWithStreamAsync.
private async Task<IList<DetectedFace>> UploadAndDetectFaces(string imageFilePath)
{
    // The list of Face attributes to return.
    IList<FaceAttributeType> faceAttributes =
        new FaceAttributeType[]
        {
            FaceAttributeType.Gender, FaceAttributeType.Age,
            FaceAttributeType.Smile, FaceAttributeType.Emotion,
            FaceAttributeType.Glasses, FaceAttributeType.Hair
        };

    // Call the Face API.
    try
    {
        using (Stream imageFileStream = File.OpenRead(imageFilePath))
        {
            // The second argument specifies to return the faceId, while
            // the third argument specifies not to return face landmarks.
            IList<DetectedFace> faceList =
                await faceClient.Face.DetectWithStreamAsync(
                    imageFileStream, true, false, faceAttributes);
            return faceList;
        }
    }
    // Catch and display Face API errors.
    catch (APIErrorException f)
    {
        MessageBox.Show(f.Message);
        return new List<DetectedFace>();
    }
    // Catch and display all other errors.
    catch (Exception e)
    {
        MessageBox.Show(e.Message, "Error");
        return new List<DetectedFace>();
    }
}
```

## Draw rectangles around each face

Next, you will add the code to draw a rectangle around each detected face in the image. In *MainWindow.xaml.cs*, add the `async` modifier to the **BrowseButton_Click** method.

```csharp
private async void BrowseButton_Click(object sender, RoutedEventArgs e)
```

Insert the following code at the end of the **BrowseButton_Click** method, after the `FacePhoto.Source = bitmapSource` line. This populates a list of detected faces from the call to **UploadAndDetectFaces**. Then it draws a rectangle around each face and displays the modified image in the main window.

```csharp
// Detect any faces in the image.
Title = "Detecting...";
faceList = await UploadAndDetectFaces(filePath);
Title = String.Format(
    "Detection Finished. {0} face(s) detected", faceList.Count);

if (faceList.Count > 0)
{
    // Prepare to draw rectangles around the faces.
    DrawingVisual visual = new DrawingVisual();
    DrawingContext drawingContext = visual.RenderOpen();
    drawingContext.DrawImage(bitmapSource,
        new Rect(0, 0, bitmapSource.Width, bitmapSource.Height));
    double dpi = bitmapSource.DpiX;
    resizeFactor = (dpi > 0) ? 96 / dpi : 1;
    faceDescriptions = new String[faceList.Count];

    for (int i = 0; i < faceList.Count; ++i)
    {
        DetectedFace face = faceList[i];

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
    faceDescriptionStatusBar.Text =
        "Place the mouse pointer over a face to see the face description.";
}
```

## Describe the faces in the image

Add the following method to the **MainWindow** class, below the **UploadAndDetectFaces** method. This converts the retrieved face attributes into a string describing the face.

```csharp
// Creates a string out of the attributes describing the face.
private string FaceDescription(DetectedFace face)
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
    Emotion emotionScores = face.FaceAttributes.Emotion;
    if (emotionScores.Anger >= 0.1f)
        sb.Append(String.Format("anger {0:F1}%, ", emotionScores.Anger * 100));
    if (emotionScores.Contempt >= 0.1f)
        sb.Append(String.Format("contempt {0:F1}%, ", emotionScores.Contempt * 100));
    if (emotionScores.Disgust >= 0.1f)
        sb.Append(String.Format("disgust {0:F1}%, ", emotionScores.Disgust * 100));
    if (emotionScores.Fear >= 0.1f)
        sb.Append(String.Format("fear {0:F1}%, ", emotionScores.Fear * 100));
    if (emotionScores.Happiness >= 0.1f)
        sb.Append(String.Format("happiness {0:F1}%, ", emotionScores.Happiness * 100));
    if (emotionScores.Neutral >= 0.1f)
        sb.Append(String.Format("neutral {0:F1}%, ", emotionScores.Neutral * 100));
    if (emotionScores.Sadness >= 0.1f)
        sb.Append(String.Format("sadness {0:F1}%, ", emotionScores.Sadness * 100));
    if (emotionScores.Surprise >= 0.1f)
        sb.Append(String.Format("surprise {0:F1}%, ", emotionScores.Surprise * 100));

    // Add glasses.
    sb.Append(face.FaceAttributes.Glasses);
    sb.Append(", ");

    // Add hair.
    sb.Append("Hair: ");

    // Display baldness confidence if over 1%.
    if (face.FaceAttributes.Hair.Bald >= 0.01f)
        sb.Append(String.Format("bald {0:F1}% ", face.FaceAttributes.Hair.Bald * 100));

    // Display all hair color attributes over 10%.
    IList<HairColor> hairColors = face.FaceAttributes.Hair.HairColor;
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

Add the following code to the **FacePhoto_MouseMove** method. This event handler  displays the face description string in `faceDescriptionStatusBar` when the cursor hovers over a detected face rectangle.

```csharp
// If the REST call has not completed, return.
if (faceList == null)
    return;

// Find the mouse position relative to the image.
Point mouseXY = e.GetPosition(FacePhoto);

ImageSource imageSource = FacePhoto.Source;
BitmapSource bitmapSource = (BitmapSource)imageSource;

// Scale adjustment between the actual size and displayed size.
var scale = FacePhoto.ActualWidth / (bitmapSource.PixelWidth / resizeFactor);

// Check if this mouse position is over a face rectangle.
bool mouseOverFace = false;

for (int i = 0; i < faceList.Count; ++i)
{
    FaceRectangle fr = faceList[i].FaceRectangle;
    double left = fr.Left * scale;
    double top = fr.Top * scale;
    double width = fr.Width * scale;
    double height = fr.Height * scale;

    // Display the face description if the mouse is over this face rectangle.
    if (mouseXY.X >= left && mouseXY.X <= left + width &&
        mouseXY.Y >= top  && mouseXY.Y <= top + height)
    {
        faceDescriptionStatusBar.Text = faceDescriptions[i];
        mouseOverFace = true;
        break;
    }
}

// String to display when the mouse is not over a face rectangle.
if (!mouseOverFace)
    faceDescriptionStatusBar.Text =
        "Place the mouse pointer over a face to see the face description.";

```

## Run the app

Run the application and browse for an image containing a face. Wait for a few seconds to allow the Face service to respond. You should see a red rectangle on each of the faces in the image. If you move the mouse over a face rectangle, the description of that face should appear in the status bar.

![Screenshot showing detected faces framed with rectangles](../Images/getting-started-cs-detected.png)


## Next steps

In this tutorial, you learned the basic process for using the Face service .NET SDK and created an application to detect and frame faces in an image. Next, see How to Detect Faces in an Image to learn more about the details of face detection.

> [!div class="nextstepaction"]
> [How to Detect Faces in an Image](../Face-API-How-to-Topics/HowtoDetectFacesinImage.md)
