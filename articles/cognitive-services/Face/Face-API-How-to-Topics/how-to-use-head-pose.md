---
title: Use HeadPost to adjust the face rectangle
titleSuffix: Azure Cognitive Services
description: Learn how to use the HeadPose attribute to automatically rotate the face rectangle.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 04/22/2019
ms.author: pafarley
---

# Use the HeadPose attribute to adjust the face rectangle

In this guide, you will use a detected face attribute, HeadPose, to rotate the rectangle of a Face object. The sample code in this guide, from the [Face API WPF Sample Application](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/app-samples/Cognitive-Services-Face-WPF), uses the .NET SDK.

The face rectangle, returned with every detected face, marks the location and size of the face in the image. By default, the rectangle is always aligned with the image (its sides are perfectly vertical and horizontal); this can be inefficient for framing angled faces. In situations where you want to programmatically crop faces in an image, it is advantageous to be able to rotate the rectangle to crop.

## Explore the sample code

You can programmatically rotate the face rectangle by using the HeadPose attribute. If you specify this attribute when detecting faces (see [How to detect faces](HowtoDetectFacesinImage.md)), you will be able to query it later. The following method from the [Face API WPF Sample Application](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/app-samples/Cognitive-Services-Face-WPF) takes a list of **DetectedFace** objects and returns a list of **[Face](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/app-samples/Cognitive-Services-Face-WPF/Sample-WPF/Controls/Face.cs)** objects. **Face** here is a custom class that stores face data, including the updated rectangle coordinates. New values are calculated for **top**, **left**, **width**, and **height**, and a new field **FaceAngle** specifies the rotation.

```csharp
/// <summary>
/// Calculate the rendering face rectangle
/// </summary>
/// <param name="faces">Detected face from service</param>
/// <param name="maxSize">Image rendering size</param>
/// <param name="imageInfo">Image width and height</param>
/// <returns>Face structure for rendering</returns>
public static IEnumerable<Face> CalculateFaceRectangleForRendering(IList<DetectedFace> faces, int maxSize, Tuple<int, int> imageInfo)
{
    var imageWidth = imageInfo.Item1;
    var imageHeight = imageInfo.Item2;
    float ratio = (float)imageWidth / imageHeight;
    int uiWidth = 0;
    int uiHeight = 0;
    if (ratio > 1.0)
    {
        uiWidth = maxSize;
        uiHeight = (int)(maxSize / ratio);
    }
    else
    {
        uiHeight = maxSize;
        uiWidth = (int)(ratio * uiHeight);
    }

    int uiXOffset = (maxSize - uiWidth) / 2;
    int uiYOffset = (maxSize - uiHeight) / 2;
    float scale = (float)uiWidth / imageWidth;

    foreach (var face in faces)
    {                
        var Left = (int)((face.FaceRectangle.Left * scale) + uiXOffset);
        var Top = (int)((face.FaceRectangle.Top * scale) + uiYOffset);

        // FaceAngle use for roate face Rect, default is 0(no rotate).
        double FaceAngle = 0;

        // If there has headpose attributes, will re-calculate the left/top(X/Y) position.
        if (face.FaceAttributes?.HeadPose != null)
        {
            // Headpose's roll value act directly on face angle. 
            FaceAngle = face.FaceAttributes.HeadPose.Roll;
            var angleToPi = Math.Abs((FaceAngle / 180) * Math.PI);

            // _____       | / \ |
            // |____|  =>  |/   /|
            //             | \ / |
            // re-calculate the face Rect left/top(X/Y) position.
            var newLeft = face.FaceRectangle.Left +
                face.FaceRectangle.Width / 2 -
                (face.FaceRectangle.Width * Math.Sin(angleToPi) + face.FaceRectangle.Height * Math.Cos(angleToPi)) / 2;

            var newTop = face.FaceRectangle.Top +
                face.FaceRectangle.Height / 2 -
                (face.FaceRectangle.Height * Math.Sin(angleToPi) + face.FaceRectangle.Width * Math.Cos(angleToPi)) / 2;

            Left = (int)((newLeft * scale) + uiXOffset);
            Top = (int)((newTop * scale) + uiYOffset);
        }

        yield return new Face()
        {
            FaceId = face.FaceId?.ToString(),
            Left = Left,
            Top = Top,
            OriginalLeft = (int)((face.FaceRectangle.Left * scale) + uiXOffset),
            OriginalTop = (int)((face.FaceRectangle.Top * scale) + uiYOffset),
            Height = (int)(face.FaceRectangle.Height * scale),
            Width = (int)(face.FaceRectangle.Width * scale),
            FaceAngle = FaceAngle,
        };
    }
}
```

## Display the updated rectangle

From here, you can use the returned **Face** objects in your display. The following lines from [FaceDetectionPage.xaml](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/app-samples/Cognitive-Services-Face-WPF/Sample-WPF/Controls/FaceDetectionPage.xaml) show how the new rectangle is rendered from this data:

```xaml
<DataTemplate>
    <Rectangle Width="{Binding Width}" Height="{Binding Height}" Stroke="#FF26B8F4" StrokeThickness="1">
        <Rectangle.LayoutTransform>
            <RotateTransform CenterX="-0.5" CenterY="-0.5" Angle="{Binding FaceAngle}"/>
        </Rectangle.LayoutTransform>
    </Rectangle>
</DataTemplate>
```

## Next steps

See the [Face API WPF Sample Application](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/app-samples/Cognitive-Services-Face-WPF) on GitHub for a working example of rotated face rectangles. Or, see the [PoseTest](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/app-samples) sample app, which tracks the HeadPose attribute in real time to detect various head movements (nodding, shaking).