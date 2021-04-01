1. Clone the repo from this location: https://github.com/Azure-Samples/live-video-analytics-iot-edge-python.
<!-- Above link needs to be updated to new Python sample location-->
1. In Visual Studio Code, open the folder where the repo has been downloaded.
1. In Visual Studio Code, go to the *src/cloud-to-device-console-app* folder. There, create a file and name it *appsettings.json*. This file will contain the settings needed to run the program.
1. Copy the contents from the *~/clouddrive/ava-sample/appsettings.json* file that you generated earlier in this quickstart.

    The text should look like the following output.

    ```
    {  
        "IoThubConnectionString" : "HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX",  
        "deviceId" : "ava-sample-device",  
        "moduleId" : "avaEdge"  
    }
    ```
<!-- Above I assume we will rename the sample devices to ava-sample-device?-->
1. Go to the *src/edge* folder and create a file named *.env*.
1. Copy the contents of the */clouddrive/ava-sample/edge-deployment/.env* file. The text should look like the following code.

    ```
    SUBSCRIPTION_ID="<Subscription ID>"  
    RESOURCE_GROUP="<Resource Group>"  
    IOTHUB_CONNECTION_STRING="HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=xxx"  
    AAD_TENANT_ID="<AAD Tenant ID>"  
    AAD_SERVICE_PRINCIPAL_ID="<AAD SERVICE_PRINCIPAL ID>"  
    AAD_SERVICE_PRINCIPAL_SECRET="<AAD SERVICE_PRINCIPAL ID>"  
    VIDEO_INPUT_FOLDER_ON_DEVICE="/home/avaedgeuser/samples/input"  
    VIDEO_OUTPUT_FOLDER_ON_DEVICE="/var/media"
    APPDATA_FOLDER_ON_DEVICE="/var/local/mediaservices"
    CONTAINER_REGISTRY_USERNAME_myacr="<your container registry username>"  
    CONTAINER_REGISTRY_PASSWORD_myacr="<your container registry password>"      
    ```
<!-- I assume we will: 
Change the local input folder to ava? 
Will we change the foldername for APPDATA? (mediaservices)
-->    