---
title: "Perform image operations - Java"
titlesuffix: "Azure Cognitive Services"
description: Explore a basic Java Swing app that uses the Computer Vision API in Azure Cognitive Services. Perform OCR, create thumbnails, and work with visual features in an image.
services: cognitive-services
author: KellyDF
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.author: kefre
ms.custom: seodec18
ms.date: 04/30/2019
---

# Use Computer Vision features with the REST API and Java

This tutorial shows the features of the Azure Cognitive Services Computer Vision REST API.

Explore a Java Swing application that uses the Computer Vision REST API to perform optical character recognition (OCR), create smart-cropped thumbnails, plus detect, categorize, tag, and describe visual features, including faces, in an image. This example lets you submit an image URL for analysis or processing. You can use this open source example as a template for building your own app in Java to use the Computer Vision REST API.

This tutorial will cover how to use Computer Vision to:

> [!div class="checklist"]
> * Analyze an image
> * Identify a natural or artificial landmark in an image
> * Identify a celebrity in an image
> * Create a quality thumbnail from an image
> * Read printed text in an image
> * Read handwritten text in an image

The Java Swing form application has already been written but has no functionality. In this tutorial, you add the code specific to the Computer Vision REST API to complete the application's functionality.

## Prerequisites

### Platform requirements

This tutorial has been developed using the NetBeans IDE. Specifically, the **Java SE** version of NetBeans, which you can [download here](https://netbeans.org/downloads/index.html).

### Subscribe to Computer Vision API and get a subscription key

Before creating the example, you must subscribe to Computer Vision API which is part of Azure Cognitive Services. For subscription and key management details, see [Subscriptions](https://azure.microsoft.com/try/cognitive-services/). Both the primary and secondary keys are valid to use in this tutorial.

## Acquire incomplete tutorial project

### Download the project

1. Go to the [Cognitive Services Java Computer Vision Tutorial](https://github.com/Azure-Samples/cognitive-services-java-computer-vision-tutorial) repository.
1. Click the **Clone or download** button.
1. Click **Download ZIP** to download a .zip file of the tutorial project.

There is no need to extract the contents of the .zip file because NetBeans imports the project from the .zip file.

### Import the tutorial project

Import the **cognitive-services-java-computer-vision-tutorial-master.zip** file into NetBeans.

1. In NetBeans, click **File** > **Import Project** > **From ZIP...**. The **Import Project(s) from ZIP** dialog box appears.
1. In the **ZIP File:** field, click the **Browse** button to locate the **cognitive-services-java-computer-vision-tutorial-master.zip** file, then click **Open**.
1. Click **Import** from the **Import Project(s) from ZIP** dialog box.
1. In the **Projects** panel, expand **ComputerVision** > **Source Packages** > **&lt;default package&gt;**. 
   Some versions of NetBeans use **src** instead of **Source Packages** > **&lt;default package&gt;**. In that case, expand **src**.
1. Double-click **MainFrame.java** to load the file into the NetBeans editor. The **Design** tab of the **MainFrame.java** file appears.
1. Click the **Source** tab to view the Java source code.

### Build and run the tutorial project

1. Press **F6** to build and run the tutorial application.

    In the tutorial application, click a tab to bring up the pane for that feature. The buttons have empty methods, so they do nothing.

    At the bottom of the window are the fields **Subscription Key** and **Subscription Region**. These fields must be filled with a valid subscription key and the correct region for that subscription key. To obtain a subscription key, see [Subscriptions](https://azure.microsoft.com/try/cognitive-services/). If you obtained your subscription key from the free trial at that link, then the default region **westcentralus** is the correct region for your subscription keys.

1. Exit the tutorial application.

## Add tutorial code to the project

The Java Swing application is set up with six tabs. Each tab demonstrates a different function of Computer Vision (analyze, OCR, and so on). The six tutorial sections do not have interdependencies, so you can add one section, all six sections, or any subset. You can add the sections in any order.

### Analyze an image

The Analyze feature of Computer Vision scans an image for more than 2,000 recognizable objects, living things, scenery, and actions. Once the analysis is complete, Analyze returns a JSON object that describes the image with descriptive tags, color analysis, captions, and more.

To complete the Analyze feature of the tutorial application, perform the following steps:

#### Add the event handler code for the analyze button

The **analyzeImageButtonActionPerformed** event handler method clears the form, displays the image specified in the URL, then calls the **AnalyzeImage** method to analyze the image. When **AnalyzeImage** returns, the method displays the formatted JSON response in the **Response** text area, extracts the first caption from the **JSONObject**, and displays the caption and the confidence level that the caption is correct.

Copy and paste the following code into the **analyzeImageButtonActionPerformed** method.

> [!NOTE]
> NetBeans won't let you paste to the method definition line (```private void```) or to the closing curly brace of that method. To copy the code, copy the lines between the method definition and the closing curly brace, and paste them over the contents of the method.

```java
    private void analyzeImageButtonActionPerformed(java.awt.event.ActionEvent evt) {
        URL analyzeImageUrl;
        
        // Clear out the previous image, response, and caption, if any.
        analyzeImage.setIcon(new ImageIcon());
        analyzeCaptionLabel.setText("");
        analyzeResponseTextArea.setText("");
        
        // Display the image specified in the text box.
        try {
            analyzeImageUrl = new URL(analyzeImageUriTextBox.getText());
            BufferedImage bImage = ImageIO.read(analyzeImageUrl);
            scaleAndShowImage(bImage, analyzeImage);
        } catch(IOException e) {
            analyzeResponseTextArea.setText("Error loading Analyze image: " + e.getMessage());
            return;
        }
        
        // Analyze the image.
        JSONObject jsonObj = AnalyzeImage(analyzeImageUrl.toString());
        
        // A return of null indicates failure.
        if (jsonObj == null) {
            return;
        }
        
        // Format and display the JSON response.
        analyzeResponseTextArea.setText(jsonObj.toString(2));
                
        // Extract the text and confidence from the first caption in the description object.
        if (jsonObj.has("description") && jsonObj.getJSONObject("description").has("captions")) {

            JSONObject jsonCaption = jsonObj.getJSONObject("description").getJSONArray("captions").getJSONObject(0);
            
            if (jsonCaption.has("text") && jsonCaption.has("confidence")) {
                
                analyzeCaptionLabel.setText("Caption: " + jsonCaption.getString("text") + 
                        " (confidence: " + jsonCaption.getDouble("confidence") + ").");
            }
        }
    }
```

#### Add the wrapper for the REST API call

The **AnalyzeImage** method wraps the REST API call to analyze an image. The method returns a **JSONObject** describing the image, or **null** if there was an error.

Copy and paste the **AnalyzeImage** method to just underneath the **analyzeImageButtonActionPerformed** method.

```java
    /**
     * Encapsulates the Microsoft Cognitive Services REST API call to analyze an image.
     * @param imageUrl: The string URL of the image to analyze.
     * @return: A JSONObject describing the image, or null if a runtime error occurs.
     */
    private JSONObject AnalyzeImage(String imageUrl) {
        try (CloseableHttpClient httpclient = HttpClientBuilder.create().build())
        {
            // Create the URI to access the REST API call for Analyze Image.
            String uriString = uriBasePreRegion + 
                    String.valueOf(subscriptionRegionComboBox.getSelectedItem()) + 
                    uriBasePostRegion + uriBaseAnalyze;
            URIBuilder builder = new URIBuilder(uriString);

            // Request parameters. All of them are optional.
            builder.setParameter("visualFeatures", "Categories,Description,Color,Adult");
            builder.setParameter("language", "en");

            // Prepare the URI for the REST API call.
            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);

            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", subscriptionKeyTextField.getText());

            // Request body.
            StringEntity reqEntity = new StringEntity("{\"url\":\"" + imageUrl + "\"}");
            request.setEntity(reqEntity);

            // Execute the REST API call and get the response entity.
            HttpResponse response = httpclient.execute(request);
            HttpEntity entity = response.getEntity();

            // If we got a response, parse it and display it.
            if (entity != null)
            {
                // Return the JSONObject.
                String jsonString = EntityUtils.toString(entity);
                return new JSONObject(jsonString);
            } else {
                // No response. Return null.
                return null;
            }
        }
        catch (Exception e)
        {
            // Display error message.
            System.out.println(e.getMessage());
            return null;
        }
    }
 ```

#### Run the Analyze function

Press **F6** to run the application. Put your subscription key into the **Subscription Key** field and verify that you are using the correct region in **Subscription Region**. Enter a URL to an image to analyze, then click the **Analyze Image** button to analyze an image and see the result.

### Recognize a landmark

The Landmark feature of Computer Vision analyzes an image for natural and artificial landmarks, such as mountains or famous buildings. Once the analysis is complete, Landmark returns a JSON object that identifies the landmarks found in the image.

To complete the Landmark feature of the tutorial application, perform the following steps:

#### Add the event handler code for the form button

The **landmarkImageButtonActionPerformed** event handler method clears the form, displays the image specified in the URL, then calls the **LandmarkImage** method to analyze the image. When **LandmarkImage** returns, the method displays the formatted JSON response in the **Response** text area, then extracts the first landmark name from the **JSONObject** and displays it on the window along with the confidence level that the landmark was identified correctly.

Copy and paste the following code into the **landmarkImageButtonActionPerformed** method.

> [!NOTE]
> NetBeans won't let you paste to the method definition line (```private void```) or to the closing curly brace of that method. To copy the code, copy the lines between the method definition and the closing curly brace, and paste them over the contents of the method.

```java
    private void landmarkImageButtonActionPerformed(java.awt.event.ActionEvent evt) {
        URL landmarkImageUrl;
        
        // Clear out the previous image, response, and caption, if any.
        landmarkImage.setIcon(new ImageIcon());
        landmarkCaptionLabel.setText("");
        landmarkResponseTextArea.setText("");
        
        // Display the image specified in the text box.
        try {
            landmarkImageUrl = new URL(landmarkImageUriTextBox.getText());
            BufferedImage bImage = ImageIO.read(landmarkImageUrl);
            scaleAndShowImage(bImage, landmarkImage);
        } catch(IOException e) {
            landmarkResponseTextArea.setText("Error loading Landmark image: " + e.getMessage());
            return;
        }
        
        // Identify the landmark in the image.
        JSONObject jsonObj = LandmarkImage(landmarkImageUrl.toString());
        
        // A return of null indicates failure.
        if (jsonObj == null) {
            return;
        }
        
        // Format and display the JSON response.
        landmarkResponseTextArea.setText(jsonObj.toString(2));
                
        // Extract the text and confidence from the first caption in the description object.
        if (jsonObj.has("result") && jsonObj.getJSONObject("result").has("landmarks")) {

            JSONObject jsonCaption = jsonObj.getJSONObject("result").getJSONArray("landmarks").getJSONObject(0);
            
            if (jsonCaption.has("name") && jsonCaption.has("confidence")) {

                landmarkCaptionLabel.setText("Caption: " + jsonCaption.getString("name") + 
                        " (confidence: " + jsonCaption.getDouble("confidence") + ").");
            }
        }
    }
```

#### Add the wrapper for the REST API call

The **LandmarkImage** method wraps the REST API call to analyze an image. The method returns a **JSONObject** describing the landmarks found in the image, or **null** if there was an error.

Copy and paste the **LandmarkImage** method to just underneath the **landmarkImageButtonActionPerformed** method.

```java
     /**
     * Encapsulates the Microsoft Cognitive Services REST API call to identify a landmark in an image.
     * @param imageUrl: The string URL of the image to process.
     * @return: A JSONObject describing the image, or null if a runtime error occurs.
     */
    private JSONObject LandmarkImage(String imageUrl) {
        try (CloseableHttpClient httpclient = HttpClientBuilder.create().build())
        {
            // Create the URI to access the REST API call to identify a Landmark in an image.
            String uriString = uriBasePreRegion + 
                    String.valueOf(subscriptionRegionComboBox.getSelectedItem()) + 
                    uriBasePostRegion + uriBaseLandmark;
            URIBuilder builder = new URIBuilder(uriString);

            // Request parameters. All of them are optional.
            builder.setParameter("visualFeatures", "Categories,Description,Color");
            builder.setParameter("language", "en");

            // Prepare the URI for the REST API call.
            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);

            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", subscriptionKeyTextField.getText());

            // Request body.
            StringEntity reqEntity = new StringEntity("{\"url\":\"" + imageUrl + "\"}");
            request.setEntity(reqEntity);

            // Execute the REST API call and get the response entity.
            HttpResponse response = httpclient.execute(request);
            HttpEntity entity = response.getEntity();

            // If we got a response, parse it and display it.
            if (entity != null)
            {
                // Return the JSONObject.
                String jsonString = EntityUtils.toString(entity);
                return new JSONObject(jsonString);
            } else {
                // No response. Return null.
                return null;
            }
        }
        catch (Exception e)
        {
            // Display error message.
            System.out.println(e.getMessage());
            return null;
        }
    }
```

#### Run the landmark function

Press **F6** to run the application. Put your subscription key into the **Subscription Key** field and verify that you are using the correct region in **Subscription Region**. Click the **Landmark** tab, enter a URL to an image of a landmark, then click the **Analyze Image** button to analyze an image and see the result.

### Recognize celebrities

The Celebrities feature of Computer Vision analyzes an image for famous people. Once the analysis is complete, Celebrities returns a JSON object that identifies the Celebrities found in the image.

To complete the Celebrities feature of the tutorial application, perform the following steps:

#### Add the event handler code for the celebrities button

The **celebritiesImageButtonActionPerformed** event handler method clears the form, displays the image specified in the URL, then calls the **CelebritiesImage** method to analyze the image. When **CelebritiesImage** returns, the method displays the formatted JSON response in the **Response** text area, then extracts the first celebrity name from the **JSONObject** and displays the name on the window along with the confidence level that the celebrity was identified correctly.

Copy and paste the following code into the **celebritiesImageButtonActionPerformed** method.

> [!NOTE]
> NetBeans won't let you paste to the method definition line (```private void```) or to the closing curly brace of that method. To copy the code, copy the lines between the method definition and the closing curly brace, and paste them over the contents of the method.

```java
    private void celebritiesImageButtonActionPerformed(java.awt.event.ActionEvent evt) {
        URL celebritiesImageUrl;
        
        // Clear out the previous image, response, and caption, if any.
        celebritiesImage.setIcon(new ImageIcon());
        celebritiesCaptionLabel.setText("");
        celebritiesResponseTextArea.setText("");
        
        // Display the image specified in the text box.
        try {
            celebritiesImageUrl = new URL(celebritiesImageUriTextBox.getText());
            BufferedImage bImage = ImageIO.read(celebritiesImageUrl);
            scaleAndShowImage(bImage, celebritiesImage);
        } catch(IOException e) {
            celebritiesResponseTextArea.setText("Error loading Celebrity image: " + e.getMessage());
            return;
        }
        
        // Identify the celebrities in the image.
        JSONObject jsonObj = CelebritiesImage(celebritiesImageUrl.toString());
        
        // A return of null indicates failure.
        if (jsonObj == null) {
            return;
        }
        
        // Format and display the JSON response.
        celebritiesResponseTextArea.setText(jsonObj.toString(2));
                
        // Extract the text and confidence from the first caption in the description object.
        if (jsonObj.has("result") && jsonObj.getJSONObject("result").has("celebrities")) {

            JSONObject jsonCaption = jsonObj.getJSONObject("result").getJSONArray("celebrities").getJSONObject(0);
            
            if (jsonCaption.has("name") && jsonCaption.has("confidence")) {

                celebritiesCaptionLabel.setText("Caption: " + jsonCaption.getString("name") + 
                        " (confidence: " + jsonCaption.getDouble("confidence") + ").");
            }
        }
    }
```

#### Add the wrapper for the REST API call

The **CelebritiesImage** method wraps the REST API call to analyze an image. The method returns a **JSONObject** describing the celebrities found in the image, or **null** if there was an error.

Copy and paste the **CelebritiesImage** method to just underneath the **celebritiesImageButtonActionPerformed** method.

```java
     /**
     * Encapsulates the Microsoft Cognitive Services REST API call to identify celebrities in an image.
     * @param imageUrl: The string URL of the image to process.
     * @return: A JSONObject describing the image, or null if a runtime error occurs.
     */
    private JSONObject CelebritiesImage(String imageUrl) {
        try (CloseableHttpClient httpclient = HttpClientBuilder.create().build())
        {
            // Create the URI to access the REST API call to identify celebrities in an image.
            String uriString = uriBasePreRegion + 
                    String.valueOf(subscriptionRegionComboBox.getSelectedItem()) + 
                    uriBasePostRegion + uriBaseCelebrities;
            URIBuilder builder = new URIBuilder(uriString);

            // Request parameters. All of them are optional.
            builder.setParameter("visualFeatures", "Categories,Description,Color");
            builder.setParameter("language", "en");

            // Prepare the URI for the REST API call.
            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);

            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", subscriptionKeyTextField.getText());

            // Request body.
            StringEntity reqEntity = new StringEntity("{\"url\":\"" + imageUrl + "\"}");
            request.setEntity(reqEntity);

            // Execute the REST API call and get the response entity.
            HttpResponse response = httpclient.execute(request);
            HttpEntity entity = response.getEntity();

            // If we got a response, parse it and display it.
            if (entity != null)
            {
                // Return the JSONObject.
                String jsonString = EntityUtils.toString(entity);
                return new JSONObject(jsonString);
            } else {
                // No response. Return null.
                return null;
            }
        }
        catch (Exception e)
        {
            // Display error message.
            System.out.println(e.getMessage());
            return null;
        }
    }
```

#### Run the celebrities function

Press **F6** to run the application. Put your subscription key into the **Subscription Key** field and verify that you are using the correct region in **Subscription Region**. Click the **Celebrities** tab, enter a URL to an image of a celebrity, then click the **Analyze Image** button to analyze an image and see the result.

### Intelligently generate a thumbnail

The Thumbnail feature of Computer Vision generates a thumbnail from an image. By using the **Smart Crop** feature, the Thumbnail feature will identify the area of interest in an image and center the thumbnail on this area, to generate more aesthetically pleasing thumbnail images.

To complete the Thumbnail feature of the tutorial application, perform the following steps:

#### Add the event handler code for the thumbnail button

The **thumbnailImageButtonActionPerformed** event handler method clears the form, displays the image specified in the URL, then calls the **getThumbnailImage** method to create the thumbnail. When **getThumbnailImage** returns, the method displays the generated thumbnail.

Copy and paste the following code into the **thumbnailImageButtonActionPerformed** method.

> [!NOTE]
> NetBeans won't let you paste to the method definition line (```private void```) or to the closing curly brace of that method. To copy the code, copy the lines between the method definition and the closing curly brace, and paste them over the contents of the method.

```java
    private void thumbnailImageButtonActionPerformed(java.awt.event.ActionEvent evt) {
        URL thumbnailImageUrl;
        JSONObject jsonError[] = new JSONObject[1];
        
        // Clear out the previous image, response, and thumbnail, if any.
        thumbnailSourceImage.setIcon(new ImageIcon());
        thumbnailResponseTextArea.setText("");
        thumbnailImage.setIcon(new ImageIcon());

        // Display the image specified in the text box.
        try {
            thumbnailImageUrl = new URL(thumbnailImageUriTextBox.getText());
            BufferedImage bImage = ImageIO.read(thumbnailImageUrl);
            scaleAndShowImage(bImage, thumbnailSourceImage);
        } catch(IOException e) {
            thumbnailResponseTextArea.setText("Error loading image to thumbnail: " + e.getMessage());
            return;
        }
        
        // Get the thumbnail for the image.
        BufferedImage thumbnail = getThumbnailImage(thumbnailImageUrl.toString(), jsonError);
        
        // A non-null value indicates error.
        if (jsonError[0] != null) {
            // Format and display the JSON error.
            thumbnailResponseTextArea.setText(jsonError[0].toString(2));
            return;
        }
        
        // Display the thumbnail.
        if (thumbnail != null) {
            scaleAndShowImage(thumbnail, thumbnailImage);
        }
    }
```

#### Add the wrapper for the REST API call

The **getThumbnailImage** method wraps the REST API call to analyze an image. The method returns a **BufferedImage** that contains the thumbnail, or **null** if there was an error. The error message will be returned in the first element of the **jsonError** string array.

Copy and paste the following **getThumbnailImage** method to just underneath the **thumbnailImageButtonActionPerformed** method.

```java
     /**
     * Encapsulates the Microsoft Cognitive Services REST API call to create a thumbnail for an image.
     * @param imageUrl: The string URL of the image to process.
     * @return: A BufferedImage containing the thumbnail, or null if a runtime error occurs. In the case
     * of an error, the error message will be returned in the first element of the jsonError string array.
     */
    private BufferedImage getThumbnailImage(String imageUrl, JSONObject[] jsonError) {
        try (CloseableHttpClient httpclient = HttpClientBuilder.create().build())
        {
            // Create the URI to access the REST API call to identify celebrities in an image.
            String uriString = uriBasePreRegion + 
                    String.valueOf(subscriptionRegionComboBox.getSelectedItem()) + 
                    uriBasePostRegion + uriBaseThumbnail;
            URIBuilder uriBuilder = new URIBuilder(uriString);

            // Request parameters.
            uriBuilder.setParameter("width", "100");
            uriBuilder.setParameter("height", "150");
            uriBuilder.setParameter("smartCropping", "true");

            // Prepare the URI for the REST API call.
            URI uri = uriBuilder.build();
            HttpPost request = new HttpPost(uri);

            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", subscriptionKeyTextField.getText());

            // Request body.
            StringEntity requestEntity = new StringEntity("{\"url\":\"" + imageUrl + "\"}");
            request.setEntity(requestEntity);

            // Execute the REST API call and get the response entity.
            HttpResponse response = httpclient.execute(request);
            HttpEntity entity = response.getEntity();

            // Check for success.
            if (response.getStatusLine().getStatusCode() == 200)
            {
                // Return the thumbnail.
                return ImageIO.read(entity.getContent());
            }
            else
            {
                // Format and display the JSON error message.
                String jsonString = EntityUtils.toString(entity);
                jsonError[0] = new JSONObject(jsonString);
                return null;
            }
        }
        catch (Exception e)
        {
            String errorMessage = e.getMessage();
            System.out.println(errorMessage);
            jsonError[0] = new JSONObject(errorMessage);
            return null;
        }
    }
```

#### Run the thumbnail function

Press **F6** to run the application. Put your subscription key into the **Subscription Key** field and verify that you are using the correct region in **Subscription Region**. Click the **Thumbnail** tab, enter a URL to an image, then click the **Generate Thumbnail** button to analyze an image and see the result.

### Read printed text (OCR)

The Optical Character Recognition (OCR) feature of Computer Vision analyzes an image of printed text. After the analysis is complete, OCR returns a JSON object that contains the text and the location of the text in the image.

To complete the OCR feature of the tutorial application, perform the following steps:

#### Add the event handler code for the OCR button

The **ocrImageButtonActionPerformed** event handler method clears the form, displays the image specified in the URL, then calls the **OcrImage** method to analyze the image. When **OcrImage** returns, the method displays the detected text as formatted JSON in the **Response** text area.

Copy and paste the following code into the **ocrImageButtonActionPerformed** method.

> [!NOTE]
> NetBeans won't let you paste to the method definition line (```private void```) or to the closing curly brace of that method. To copy the code, copy the lines between the method definition and the closing curly brace, and paste them over the contents of the method.

```java
    private void ocrImageButtonActionPerformed(java.awt.event.ActionEvent evt) {
        URL ocrImageUrl;
        
        // Clear out the previous image, response, and caption, if any.
        ocrImage.setIcon(new ImageIcon());
        ocrResponseTextArea.setText("");
        
        // Display the image specified in the text box.
        try {
            ocrImageUrl = new URL(ocrImageUriTextBox.getText());
            BufferedImage bImage = ImageIO.read(ocrImageUrl);
            scaleAndShowImage(bImage, ocrImage);
        } catch(IOException e) {
            ocrResponseTextArea.setText("Error loading OCR image: " + e.getMessage());
            return;
        }
        
        // Read the text in the image.
        JSONObject jsonObj = OcrImage(ocrImageUrl.toString());
        
        // A return of null indicates failure.
        if (jsonObj == null) {
            return;
        }
        
        // Format and display the JSON response.
        ocrResponseTextArea.setText(jsonObj.toString(2));
    }
```

#### Add the wrapper for the REST API call

The **OcrImage** method wraps the REST API call to analyze an image. The method returns a **JSONObject** of the JSON data returned from the call, or **null** if there was an error.

Copy and paste the following **OcrImage** method to just underneath the **ocrImageButtonActionPerformed** method.

```java
     /**
     * Encapsulates the Microsoft Cognitive Services REST API call to read text in an image.
     * @param imageUrl: The string URL of the image to process.
     * @return: A JSONObject describing the image, or null if a runtime error occurs.
     */
    private JSONObject OcrImage(String imageUrl) {
        try (CloseableHttpClient httpclient = HttpClientBuilder.create().build())
        {
            // Create the URI to access the REST API call to read text in an image.
            String uriString = uriBasePreRegion + 
                    String.valueOf(subscriptionRegionComboBox.getSelectedItem()) + 
                    uriBasePostRegion + uriBaseOcr;
            URIBuilder uriBuilder = new URIBuilder(uriString);

            // Request parameters.
            uriBuilder.setParameter("language", "unk");
            uriBuilder.setParameter("detectOrientation ", "true");

            // Prepare the URI for the REST API call.
            URI uri = uriBuilder.build();
            HttpPost request = new HttpPost(uri);

            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", subscriptionKeyTextField.getText());

            // Request body.
            StringEntity reqEntity = new StringEntity("{\"url\":\"" + imageUrl + "\"}");
            request.setEntity(reqEntity);

            // Execute the REST API call and get the response entity.
            HttpResponse response = httpclient.execute(request);
            HttpEntity entity = response.getEntity();

            // If we got a response, parse it and display it.
            if (entity != null)
            {
                // Return the JSONObject.
                String jsonString = EntityUtils.toString(entity);
                return new JSONObject(jsonString);
            } else {
                // No response. Return null.
                return null;
            }
        }
        catch (Exception e)
        {
            // Display error message.
            System.out.println(e.getMessage());
            return null;
        }
    }
```

#### Run the OCR function

Press **F6** to run the application. Put your subscription key into the **Subscription Key** field and verify that you are using the correct region in **Subscription Region**. Click the **OCR** tab, enter a URL to an image of printed text, then click the **Read Image** button to analyze an image and see the result.

### Read handwritten text (handwriting recognition)

The Handwriting Recognition feature of Computer Vision analyzes an image of handwritten text. After the analysis is complete, Handwriting Recognition returns a JSON object that contains the text and the location of the text in the image.

To complete the Handwriting Recognition feature of the tutorial application, perform the following steps:

#### Add the event handler code for the handwriting button

The **handwritingImageButtonActionPerformed** event handler method clears the form, displays the image specified in the URL, then calls the **HandwritingImage** method to analyze the image. When **HandwritingImage** returns, the method displays the detected text as formatted JSON in the **Response** text area.

Copy and paste the following code into the **handwritingImageButtonActionPerformed** method.

> [!NOTE]
> NetBeans won't let you paste to the method definition line (```private void```) or to the closing curly brace of that method. To copy the code, copy the lines between the method definition and the closing curly brace, and paste them over the contents of the method.

```java
    private void handwritingImageButtonActionPerformed(java.awt.event.ActionEvent evt) {
        URL handwritingImageUrl;
        
        // Clear out the previous image, response, and caption, if any.
        handwritingImage.setIcon(new ImageIcon());
        handwritingResponseTextArea.setText("");
        
        // Display the image specified in the text box.
        try {
            handwritingImageUrl = new URL(handwritingImageUriTextBox.getText());
            BufferedImage bImage = ImageIO.read(handwritingImageUrl);
            scaleAndShowImage(bImage, handwritingImage);
        } catch(IOException e) {
            handwritingResponseTextArea.setText("Error loading Handwriting image: " + e.getMessage());
            return;
        }
        
        // Read the text in the image.
        JSONObject jsonObj = HandwritingImage(handwritingImageUrl.toString());
        
        // A return of null indicates failure.
        if (jsonObj == null) {
            return;
        }
        
        // Format and display the JSON response.
        handwritingResponseTextArea.setText(jsonObj.toString(2));
    }
```

#### Add the wrapper for the REST API call

The **HandwritingImage** method wraps the two REST API calls needed to analyze an image. Because handwriting recognition is a time consuming process, a two step process is used. The first call submits the image for processing; the second call retrieves the detected text when the processing is complete.

After the text is retrieved, the **HandwritingImage** method returns a **JSONObject** describing the text and the locations of the text, or **null** if there was an error.

Copy and paste the following **HandwritingImage** method to just underneath the **handwritingImageButtonActionPerformed** method.

```java
     /**
     * Encapsulates the Microsoft Cognitive Services REST API call to read handwritten text in an image.
     * @param imageUrl: The string URL of the image to process.
     * @return: A JSONObject describing the image, or null if a runtime error occurs.
     */
    private JSONObject HandwritingImage(String imageUrl) {
        try (CloseableHttpClient textClient = HttpClientBuilder.create().build();
             CloseableHttpClient resultClient = HttpClientBuilder.create().build())
        {
            // Create the URI to access the REST API call to read text in an image.
            String uriString = uriBasePreRegion + 
                    String.valueOf(subscriptionRegionComboBox.getSelectedItem()) + 
                    uriBasePostRegion + uriBaseHandwriting;
            URIBuilder uriBuilder = new URIBuilder(uriString);
            
            // Request parameters.
            uriBuilder.setParameter("handwriting", "true");

            // Prepare the URI for the REST API call.
            URI uri = uriBuilder.build();
            HttpPost request = new HttpPost(uri);

            // Request headers.
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Ocp-Apim-Subscription-Key", subscriptionKeyTextField.getText());

            // Request body.
            StringEntity reqEntity = new StringEntity("{\"url\":\"" + imageUrl + "\"}");
            request.setEntity(reqEntity);

            // Execute the REST API call and get the response.
            HttpResponse textResponse = textClient.execute(request);
            
            // Check for success.
            if (textResponse.getStatusLine().getStatusCode() != 202) {
                // An error occurred. Return the JSON error message.
                HttpEntity entity = textResponse.getEntity();
                String jsonString = EntityUtils.toString(entity);
                return new JSONObject(jsonString);
            }
            
            String operationLocation = null;

            // The 'Operation-Location' in the response contains the URI to retrieve the recognized text.
            Header[] responseHeaders = textResponse.getAllHeaders();
            for(Header header : responseHeaders) {
                if(header.getName().equals("Operation-Location"))
                {
                    // This string is the URI where you can get the text recognition operation result.
                    operationLocation = header.getValue();
                    break;
                }
            }
            
            // NOTE: The response may not be immediately available. Handwriting recognition is an
            // async operation that can take a variable amount of time depending on the length
            // of the text you want to recognize. You may need to wait or retry this operation.
            //
            // This example checks once per second for ten seconds.
            
            JSONObject responseObj = null;
            int i = 0;
            do {
                // Wait one second.
                Thread.sleep(1000);
                
                // Check to see if the operation completed.
                HttpGet resultRequest = new HttpGet(operationLocation);
                resultRequest.setHeader("Ocp-Apim-Subscription-Key", subscriptionKeyTextField.getText());
                HttpResponse resultResponse = resultClient.execute(resultRequest);
                HttpEntity responseEntity = resultResponse.getEntity();
                if (responseEntity != null)
                {
                    // Get the JSON response.
                    String jsonString = EntityUtils.toString(responseEntity);
                    responseObj = new JSONObject(jsonString);
                }
            }
            while (i < 10 && responseObj != null &&
                    !responseObj.getString("status").equalsIgnoreCase("Succeeded"));
            
            // If the operation completed, return the JSON object.
            if (responseObj != null) {
                return responseObj;
            } else {
                // Return null for timeout error.
                System.out.println("Timeout error.");
                return null;
            }
        }
        catch (Exception e)
        {
            // Display error message.
            System.out.println(e.getMessage());
            return null;
        }
    }
```

#### Run the handwriting function

To run the application, press **F6**. Put your subscription key into the **Subscription Key** field and verify that you are using the correct region in **Subscription Region**. Click the **Read Handwritten Text** tab, enter a URL to an image of handwritten text, then click the **Read Image** button to analyze an image and see the result.

## Next steps

In this guide, you used the Computer Vision REST API with Java to test many of the available image analysis features. Next, see the reference documentation to learn more about the APIs involved.

- [Computer Vision REST API](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa)
