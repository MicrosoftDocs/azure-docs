# Tutorial: Identity Verification with Face 

This tutorial demonstrates the recommended practice to build a complete identity verification experience using the [Face service](/azure/cognitive-services/computer-vision/overview-identity). The sample app is written using JavaScript and the React Native framework. It can currently be deployed on Android and iOS devices.

In this tutorial you will learn: 
- How to obtain meaningful consent to add users into a face recognition service
- How to acquire high-accuracy face data 
- How to enroll users into a face recognition service 
- How to verify the identity of a user 

## Prerequisites
- Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
- [Create a Face resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesFace) in the Azure portal 
- Key and endpoint of Face resource 
    - Go to Face resource and click **Keys and Endpoint** on the left. You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below. 
    - You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production. 
- [!INCLUDE contributor-requirement] 

## Application workflows 

When launched, the application shows users a detailed consent screen. If the user gives consent, the app prompts for a username and password and then captures a high-quality face image using the device's camera. The next time a user tries to log in, the app will capture a high-quality face image and verify the user's identity.


New user enrollment:
1. Ask for user consent.
1. Capture a face in an image and check the quality of this image using the [Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) API.
1. Associate the face with a person in a person group using [LargePersonGroup Person-Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adcba3a7b9412a4d53f40) API and [LargePersonGroup Person-Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adf2a3a7b9412a4d53f42) API.

User verification:
1. Capture a face in an image and check the quality of this image using the Detect API.
1. Verify that this person has been enrolled using the Verify API.

## Deploy the sample app 

#### [Android](#tab/android) 
(TBD that link ^)

1. Clone the git repository for the [sample app](https://github.com/azure-samples/cognitive-services-FaceAPIEnrollmentSample). 
1. To set up your development environment, follow the [React Native documentation](https://reactnative.dev/docs/environment-setup). **Select React Native CLI Quickstart**. Select your development OS and **Android** as the target OS. Complete the sections **Installing dependencies** and **Android development environment**. 
1. Open your preferred text editor such as [Visual Studio Code](https://code.visualstudio.com/). 
1. Retrieve your Face API endpoint URL and key in the Azure portal under the **Overview** tab of your resource. (TBD) Don't check in your Face API key to your remote repository. 
1. Run the app using either the Android Virtual Device emulator from Android Studio, or your own Android device. To test your app on a physical device, follow the relevant [React Native documentation](https://reactnative.dev/docs/running-on-device). 

#### [iOS](#tab/ios) 

1. Clone the git repository for the [sample app](https://github.com/azure-samples/cognitive-services-FaceAPIEnrollmentSample). 
1. To set up your development environment, follow the [React Native documentation](https://reactnative.dev/docs/environment-setup). Select **React Native CLI Quickstart**. Select **macOS** as your development OS and **iOS** as the target OS. Complete the section **Installing dependencies**. 
1. Open your preferred text editor such as [Visual Studio Code](https://code.visualstudio.com/). Also download [Xcode](https://developer.apple.com/xcode/) if you don't already have it. 
1. Retrieve your Face API endpoint URL and key in the Azure portal under the **Overview** tab of your resource. Don't check in your Face API key to your remote repository. 
1. Run the app using either a simulated device from Xcode, or your own iOS device. To test your app on a physical device, follow the relevant [React Native documentation](https://reactnative.dev/docs/running-on-device). 

## Customize the app for your business 

Consider the following optional steps to fine-tune the user experience of your app.

1. Add more instructions to improve verification accuracy.
   
   Many face recognition issues are caused by low-quality reference images. Some factors that can degrade model performance are: 
   * Face size (faces that are distant from the camera) 
   * Face orientation (faces turned or tilted away from camera) 
   * Poor lighting conditions (either low light or backlighting) where the image may be poorly exposed or have too much noise 
   * Occlusion (partially hidden or obstructed faces), including accessories like hats or thick-rimmed glasses
   * Blur (such as by rapid face movement when the photograph was taken). 

   The Face service provides image quality checks to help you determine whether the image is of sufficient quality to add the customer or attempt face recognition. This app demonstrates how to access frames from the device's camera, detect quality, show user interface messages to the user to help them capture a higher quality image, select the highest-quality frames, and add the detected face into the Face API service. 

1. The sample app offers functionality for deleting the user's information and the option to re-add. You can enable or disable these operations based on your business requirement. 

1. Configure your database to map each person with their ID (TBD)

   You need to use a database to store the face image along with user metadata. The social security number or other unique person identifier can be used as a key to look up their face ID. 

1. For secure methods of passing your subscription key and endpoint to Face service, see the Azure Cognitive Services [Security](/azure/cognitive-services/cognitive-services-security?tabs=command-line%2Ccsharp) guide.
