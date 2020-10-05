1. In VSCode, browse to *src/edge*. You'll see the .env file that you created along with a few deployment template files.

    The deployment template refers to the deployment manifest for the edge device with some placeholder values. The .env file has the values for those variables.
1. Next, browse to the *src/cloud-to-device-console-app* folder. Here you will see the appsettings.json file that you created along with a few other files:

   * operations.json - This file will list the different operations that you would like the program to run.
   * main.py - This is the sample program code which does the following:
    
       * Loads the app settings.
       * Invoke the Live Video Analytics on IoT Edge module’s Direct Methods to create topology, instantiate the graph and activate the graph.
       * Pauses for you to examine the graph output in the TERMINAL window and the events sent to IoT hub in the OUTPUT window.
       * Deactivate the graph instance, delete the graph instance, and delete the graph topology.  
