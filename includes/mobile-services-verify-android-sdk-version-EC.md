Because of ongoing development, the Android SDK version installed in Eclipse might not match the version in the code. The Android SDK referenced in this tutorial is version 21, the latest at the time of writing. The version number may increase as new releases of the SDK appear, and we recomend using the latest version available.

Two symptoms of version mismatch are:

1. Look in the Eclipse Console in the bottom pane. You may see error messages of the form "**Unable to resolve target 'android-n'**".

2. Standard Android objects in code that should resolve based on `import` statements may be generating error messages.

If either of these appear, the version of the Android SDK installed in Eclipse might not match the SDK target of the downloaded project.  To verify the version, make the following changes:


1. In Eclipse, click **Window**, then click **Android SDK Manager**. If you have not installed the latest version of the SDK Platform, then click to install it. Make a note of the version number.

2. Open the project file **AndroidManifest.xml**. Ensure that in the **uses-sdk** element, the **targetSdkVersion** is set to the latest version installed. The **uses-sdk** tag might look like this:
 
	 	    <uses-sdk
	 	        android:minSdkVersion="8"
	 	        android:targetSdkVersion="21" />
	
3. In the Eclipse Package Explorer right-click the project node, choose **Properties**, and in the left column choose **Android**. Ensure that the **Project Build Target** is set to the same SDK version as the **targetSdkVersion**.