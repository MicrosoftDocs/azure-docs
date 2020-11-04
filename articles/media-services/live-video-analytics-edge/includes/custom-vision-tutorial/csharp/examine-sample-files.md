1. In Visual Studio Code, browse to src/edge. You'll see the .env file that you created along with a few deployment template files.

    The deployment template refers to the deployment manifest for the edge device with some placeholder values. The .env file has the values for those variables.
1. Next, browse to the src/cloud-to-device-console-app folder. Here you'll see the appsettings.json file that you created along with a few other files:

    * c2d-console-app.csproj: This is the project file for Visual Studio Code.
    * operations.json: This file lists the different operations that you want the program to run.
    * Program.cs: This sample program code:

        * Loads the app settings.
        * Invokes the Live Video Analytics on IoT Edge module's direct methods to create topology, instantiate the graph, and activate the graph.
        * Pauses for you to examine the graph output in the **TERMINAL** window and the events sent to the IoT hub in the **OUTPUT** window.
        * Deactivates the graph instance, deletes the graph instance, and deletes the graph topology.
