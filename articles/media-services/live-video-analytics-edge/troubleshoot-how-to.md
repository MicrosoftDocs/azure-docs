---
title: Troubleshoot Live Video Analytics on IoT Edge - Azure
description: This article covers troubleshooting steps for Live Video Analytics on IoT Edge.
author: IngridAtMicrosoft
ms.topic: how-to
ms.author: inhenkel
ms.date: 05/24/2020

---

# Troubleshoot Live Video Analytics on IoT Edge

This article covers troubleshooting steps for Live Video Analytics (LVA) on Azure IoT Edge.

## Troubleshoot deployment issues

### Diagnostics

As part of your Live Video Analytics deployment, you set up Azure resources such as IoT Hub and IoT Edge devices. As a first step to diagnosing problems, always ensure that the Edge device is properly set up by following these instructions:

1. [Run the `check` command](../../iot-edge/troubleshoot.md#run-the-check-command).
1. [Check your IoT Edge version](../../iot-edge/troubleshoot.md#check-your-iot-edge-version).
1. [Check the status of the IoT Edge security manager and its logs](../../iot-edge/troubleshoot.md#check-the-status-of-the-iot-edge-security-manager-and-its-logs).
1. [View the messages that are going through the IoT Edge hub](../../iot-edge/troubleshoot.md#view-the-messages-going-through-the-iot-edge-hub).
1. [Restart containers](../../iot-edge/troubleshoot.md#restart-containers).
1. [Check your firewall and port configuration rules](../../iot-edge/troubleshoot.md#check-your-firewall-and-port-configuration-rules).

### Pre-deployment issues

If the edge infrastructure is fine, you can look for issues with the deployment manifest file. To deploy the Live Video Analytics on IoT Edge module on the IoT Edge device alongside any other IoT modules, you use a deployment manifest that contains the IoT Edge hub, IoT Edge agent, and other modules and their properties. If the JSON code isn't well formed, you might receive the following error: 

```
az iot edge set-modules --hub-name <iot-hub-name> --device-id lva-sample-device --content <path-to-deployment_manifest.json>
```

Failed to parse JSON from file: '<deployment manifest.json>' for argument 'content' with exception: "Extra data: line 101 column 1 (char 5325)"

If you encounter this error, we recommend that you check the JSON for missing brackets or other issues with the structure of the file. To validate the file structure, you can use a client such as the [Notepad++ with JSON Viewer plug-in](https://riptutorial.com/notepadplusplus/example/18201/json-viewer) or an online tool such as the [JSON Formatter & Validator](https://jsonformatter.curiousconcept.com/).

### During deployment: Diagnose with media graph direct methods 

After the Live Video Analytics on IoT Edge module is deployed correctly on the IoT Edge device, you can create and run the media graph by invoking [direct methods](direct-methods.md). You can use the Azure portal to run a diagnosis of the media graph via direct methods:

1. In the Azure portal, go to the IoT hub that's connected to your IoT Edge device.

1. Look for **Automatic device management**, and then select **IoT Edge**.  

1. In the list of Edge devices, select the device that you want to diagnose.  
         
    ![Screenshot of the Azure portal displaying a list of Edge devices](./media/troubleshoot-how-to/lva-sample-device.png)

1. Check to see whether the response code is *200-OK*. Other response codes for the [IoT Edge runtime](../../iot-edge/iot-edge-runtime.md) include:
    * 400 - The deployment configuration is malformed or invalid.
    * 417 - The device doesn't have a deployment configuration set.
    * 412 - The schema version in the deployment configuration is invalid.
    * 406 - The IoT Edge device is offline or not sending status reports.
    * 500 - An error occurred in the IoT Edge runtime.

1. If you get a status 501 code, check to ensure that the direct method name is accurate. If the method name and request payload are accurate, you should get results along with success code =200. If the request payload is inaccurate, you will get a status =400 and a response payload that indicates error code and message that should help with diagnosing the issue with your direct method call.
    * Checking on reported and desired properties can help you understand whether the module properties have synced with the deployment. If they haven't, you can restart your IoT Edge device. 
    * Use the [Direct methods](direct-methods.md) guide to call a few methods, especially simple ones such as GraphTopologyList. The guide also specifies expected request and response payloads and error codes. After the simple direct methods are successful, you can be assured that the Live Video Analytics IoT Edge module is functionally OK.
        
       ![Screenshot of the "Direct method" pane for the IoT Edge module.](./media/troubleshoot-how-to/direct-method.png) 

1. If the **Specified in deployment** and **Reported by device** columns indicate *Yes*, you can invoke direct methods on the Live Video Analytics on IoT Edge module. Select the module to go to a page where you can check the desired and reported properties and invoke direct methods. Keep in mind the following: 

### Post deployment: Diagnose logs for issues during the run 

The container logs for your IoT Edge module should contain diagnostics information to help debug your issues during module runtime. You can [check container logs for issues](../../iot-edge/troubleshoot.md#check-container-logs-for-issues) and self-diagnose the issue. 

If you've run all the preceding checks and are still encountering issues, gather logs from the IoT Edge device [with the `support bundle` command](../../iot-edge/troubleshoot.md#gather-debug-information-with-support-bundle-command) for further analysis by the Azure team. You can [contact us](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) for support and to submit the collected logs.

## Common error resolutions

Live Video Analytics is deployed as an IoT Edge module on the IoT Edge device, and it works collaboratively with the IoT Edge agent and hub modules. Some of the common errors that you'll encounter with the Live Video Analytics deployment are caused by issues with the underlying IoT infrastructure. The errors include:

* [The IoT Edge agent stops after about a minute](../../iot-edge/troubleshoot-common-errors.md#iot-edge-agent-stops-after-about-a-minute).
* [The IoT Edge agent can't access a module's image (403)](../../iot-edge/troubleshoot-common-errors.md#iot-edge-agent-cant-access-a-modules-image-403).
* [The IoT Edge agent module reports "empty config file" and no modules start on the device](../../iot-edge/troubleshoot-common-errors.md#edge-agent-module-reports-empty-config-file-and-no-modules-start-on-the-device).
* [The IoT Edge hub fails to start](../../iot-edge/troubleshoot-common-errors.md#iot-edge-hub-fails-to-start).
* [The IoT Edge security daemon fails with an invalid hostname](../../iot-edge/troubleshoot-common-errors.md#iot-edge-security-daemon-fails-with-an-invalid-hostname).
* [The Live Video Analytics or any other custom IoT Edge module fails to send a message to the edge hub with 404 error](../../iot-edge/troubleshoot-common-errors.md#iot-edge-module-fails-to-send-a-message-to-edgehub-with-404-error).
* [The IoT Edge module is deployed successfully and then disappears from the device](../../iot-edge/troubleshoot-common-errors.md#iot-edge-module-deploys-successfully-then-disappears-from-device).

### Edge setup script issues

As part of our documentation, we've provided a [setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup) to deploy edge and cloud resources and get you started with Live Video Analytics Edge. This section presents some script errors that you might encounter, along with solutions for debugging them.

Issue: The script runs, partly creating few resources, but it fails with the following message:

```
registering device...

Unable to load extension 'eventgrid: unrecognized kwargs: ['min_profile']'. Use --debug for more information.
The command failed with an unexpected error. Here is the traceback:

No module named 'azure.mgmt.iothub.iot_hub_client'
Traceback (most recent call last):
File "/opt/az/lib/python3.6/site-packages/knack/cli.py", line 215, in invoke
  cmd_result = self.invocation.execute(args)
File "/opt/az/lib/python3.6/site-packages/azure/cli/core/commands/__init__.py", line 631, in execute
  raise ex
File "/opt/az/lib/python3.6/site-packages/azure/cli/core/commands/__init__.py", line 695, in _run_jobs_serially
  results.append(self._run_job(expanded_arg, cmd_copy))
File "/opt/az/lib/python3.6/site-packages/azure/cli/core/commands/__init__.py", line 688, in _run_job
  six.reraise(*sys.exc_info())
File "/opt/az/lib/python3.6/site-packages/six.py", line 693, in reraise
  raise value
File "/opt/az/lib/python3.6/site-packages/azure/cli/core/commands/__init__.py", line 665, in _run_job
  result = cmd_copy(params)
File "/opt/az/lib/python3.6/site-packages/azure/cli/core/commands/__init__.py", line 324, in __call__
  return self.handler(*args, **kwargs)
File "/opt/az/lib/python3.6/site-packages/azure/cli/core/__init__.py", line 574, in default_command_handler
  return op(**command_args)
File "/home/.azure/cliextensions/azure-cli-iot-ext/azext_iot/operations/hub.py", line 75, in iot_device_list
  result = iot_query(cmd, query, hub_name, top, resource_group_name, login=login)
File "/home/.azure/cliextensions/azure-cli-iot-ext/azext_iot/operations/hub.py", line 45, in iot_query
  target = get_iot_hub_connection_string(cmd, hub_name, resource_group_name, login=login)
File "/home/.azure/cliextensions/azure-cli-iot-ext/azext_iot/common/_azure.py", line 112, in get_iot_hub_connection_string
  client = iot_hub_service_factory(cmd.cli_ctx)
File "/home/.azure/cliextensions/azure-cli-iot-ext/azext_iot/_factory.py", line 28, in iot_hub_service_factory
  from azure.mgmt.iothub.iot_hub_client import IotHubClient
ModuleNotFoundError: No module named 'azure.mgmt.iothub.iot_hub_client'
```
    
To fix this issue:

1. Run the following command:

    ```
    az --version
    ```
1. Ensure that you have the following extensions installed. As of the publication of this article, the extensions and their versions are:

    | Extension | Version |
    |---|---|
    |azure-cli   |      2.5.1*|
    |command-modules-nspkg         |   2.0.3|
    |core  |  	2.5.1*|
    |nspkg    |	3.0.4|
    |telemetry|	1.0.4|
    |storage-preview          |     0.2.10|
    |azure-cli-iot-ext          |    0.8.9|
    |eventgrid|	0.4.9|
    |azure-iot                       | 0.9.2|
1. If you have an installed extension whose version is earlier than the release number listed here, update the extension by using the following command:

    ```
    az extension update --name <Extension name>
    ```

    For example, you might run `az extension update --name azure-iot`.

### Sample app issues

As part of our release, we've provided some .NET sample code to help get our developer community bootstrapped. This section presents some errors you might encounter when you run the sample code, along with solutions for debugging them.

Issue: Program.cs fails with the following error on the direct method invocation:

```
Unhandled exception. Microsoft.Azure.Devices.Common.Exceptions.UnauthorizedException: {"Message":"{\"errorCode\":401002,\"trackingId\":\"b1da85801b2e4faf951a2291a2c467c3-G:32-TimeStamp:04/06/2020 17:15:11\",\"message\":\"Unauthorized\",\"timestampUtc\":\"2020-04-06T17:15:11.6990676Z\"}","ExceptionMessage":""}
    
        at Microsoft.Azure.Devices.HttpClientHelper.ExecuteAsync(HttpClient httpClient, HttpMethod httpMethod, Uri requestUri, Func`3 modifyRequestMessageAsync, Func`2 isMappedToException, Func`3 processResponseMessageAsync, IDictionary`2 errorMappingOverrides, CancellationToken cancellationToken)
    
        at Microsoft.Azure.Devices.HttpClientHelper.ExecuteAsync(HttpMethod httpMethod, Uri requestUri, Func`3 modifyRequestMessageAsync, Func`3 processResponseMessageAsync, IDictionary`2 errorMappingOverrides, CancellationToken cancellationToken)
        
        at Microsoft.Azure.Devices.HttpClientHelper.PostAsync[T,T2](Uri requestUri, T entity, TimeSpan operationTimeout, IDictionary`2 errorMappingOverrides, IDictionary`2 customHeaders, CancellationToken cancellationToken)…
```

1. Ensure that you have [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) installed in your Visual Studio Code environment, and that you've set up the connection to your IoT hub. To do so, select Ctrl+Shift+P, and then choose **Select IoT Hub method**.

1. Check to see whether you can invoke a direct method on the IoT Edge module via Visual Studio Code. For example, call GraphTopologyList with the following payload {&nbsp;"@apiVersion": "1.0"}. You should receive the following response: 

    ```
    {
      "status": 200,
      "payload": {
        "values": [
          {…
    …}
          ]
        }
    }
    ```

    ![Screenshot of the response in Visual Studio Code.](./media/troubleshoot-how-to/visual-studio-code1.png)
1. If the preceding solution fails, try the following:

    a. Go to the command prompt on your IoT Edge device, and run the following command:
    
      ```
      sudo systemctl restart iotedge
      ```

      This command restarts the IoT Edge device and all the modules. Wait a few minutes and then, before you try to use the direct method again, confirm that the modules are running by running the following command:

      ```
      sudo iotedge list
      ```

    b. If the preceding approach also fails, try rebooting your virtual machine or computer.

    c. If all approaches fail, run the following command to obtain a zipped file with all [relevant logs](../../iot-edge/troubleshoot.md#gather-debug-information-with-support-bundle-command), and attach it to a [support ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

    ```
    sudo iotedge support-bundle --since 2h
    ```

1. If you get an error response *400* code, ensure that your method invocation payload is well formed, as per the [Direct methods](direct-methods.md) guide.
1. If  you get a status *200* code, it indicates that your hub is functioning well and your module deployment is correct and responsive. 

1. Check to see whether the app configuration is accurate. Your app configuration consists of the following fields in the *appsettings.json* file. Double-check to ensure that deviceId and moduleId are accurate. An easy way to check is by going to the Azure IoT Hub extension section in Visual Studio Code. The values in the *appsettings.json* file and the IoT Hub section should match.
    
    ```
    {
        "IoThubConnectionString" : 
        "deviceId" : 
        "moduleId" : 
    }
    ```

1. In the *appsettings.json* file, ensure that you've provided the IoT Hub connection string and *not* the IoT Hub device connection string, because the [connection string formats are different](https://devblogs.microsoft.com/iotdev/understand-different-connection-strings-in-azure-iot-hub/).

### Live Video Analytics working with external modules

Live Video Analytics via the HTTP extension processor can extend the media graph to send and receive data from other IoT Edge modules over HTTP by using REST. As a [specific example](https://github.com/Azure/live-video-analytics/tree/master/MediaGraph/topologies/httpExtension), the media graph can send video frames as images to an external inference module such as Yolo v3 and receive JSON-based analytics results. In such a topology, the destination for the events is mostly the IoT hub. In situations where you don't see the inference events on the hub, check for the following:

* Check to see whether the hub that media graph is publishing to and the hub you're examining are the same. As you create multiple deployments, you might end up with multiple hubs and mistakenly check the wrong hub for events.
* In Visual Studio Code, check to see whether the external module is deployed and running. In the example image here, rtspsim and cv are IoT Edge modules running external to the lvaEdge module.

    ![Screenshot that displays the running status of modules in Azure IoT Hub.](./media/troubleshoot-how-to/iot-hub.png)

* Check to see whether you're sending events to the correct URL endpoint. The external AI container exposes a URL and a port through which it receives and returns the data from POST requests. This URL is specified as an `endpoint: url` property for the HTTP extension processor. As seen in the [topology URL](https://github.com/Azure/live-video-analytics/blob/master/MediaGraph/topologies/httpExtension/topology.json), the endpoint is set to the inferencing URL parameter. Ensure that the default value for the parameter or the passed-in value is accurate. You can test to see whether it's working by using Client URL (cURL).  

    As an example, here is a Yolo v3 container that's running on local machine with an IP address of 172.17.0.3. Use Docker inspect to find the IP address.

    ```
    curl -X POST http://172.17.0.3/score -H "Content-Type: image/jpeg" --data-binary @<fullpath to jpg>
    ```

    Result returned:

    ```
    {"inferences": [{"type": "entity", "entity": {"tag": {"value": "car", "confidence": 0.8668569922447205}, "box": {"l": 0.3853073438008626, "t": 0.6063712999658677, "w": 0.04174524943033854, "h": 0.02989496027381675}}}]}
    ```

* If you're running one or more instances of a graph that uses the HTTP extension processor, you should have a frame rate filter before each HTTP extension processor to manage the frames per second (fps) rate of the video feed. 

   In certain situations, where the CPU or memory of the edge machine is highly utilized, you can lose certain inference events. To address this issue, set a low value for the maximumFps property on the frame rate filter. You can set it to 0.5 ("maximumFps": 0.5 ) on each instance of the graph and then rerun the instance to check for inference events on the hub.

   Alternatively, you can obtain a more powerful edge machine with higher CPU and memory.
    
### Multiple direct methods in parallel – timeout failure 

Live Video Analytics on IoT Edge provides a direct method-based programming model that allows you to set up multiple topologies and multiple graph instances. As part of the topology and graph setup, you invoke multiple direct method calls on the IoT Edge module. If you invoke these multiple method calls in parallel, especially the ones that start and stop the graphs, you might experience a timeout failure such as the following: 

Assembly Initialization method Microsoft.Media.LiveVideoAnalytics.Test.Feature.Edge.AssemblyInitializer.InitializeAssemblyAsync threw exception. Microsoft.Azure.Devices.Common.Exceptions.IotHubException: Microsoft.Azure.Devices.Common.Exceptions.IotHubException:<br/> `{"Message":"{\"errorCode\":504101,\"trackingId\":\"55b1d7845498428593c2738d94442607-G:32-TimeStamp:05/15/2020 20:43:10-G:10-TimeStamp:05/15/2020 20:43:10\",\"message\":\"Timed out waiting for the response from device.\",\"info\":{},\"timestampUtc\":\"2020-05-15T20:43:10.3899553Z\"}","ExceptionMessage":""}. Aborting test execution. `

We recommend that you *not* call direct methods in parallel. Call them sequentially (that is, make one direct method call only after the previous one is finished).

### Collect logs for submitting a support ticket

When self-guided troubleshooting steps don't resolve your problem, go the Azure portal and [open a support ticket](../../azure-portal/supportability/how-to-create-azure-support-request.md).

> [!WARNING]
> The logs may contain personally identifiable information (PII) such as your IP address. All local copies of the logs will be deleted as soon as we complete examining them and close the support ticket.  

To gather the relevant logs that should be added to the ticket, follow the instructions in the next sections. You can upload the log files on the **Details** pane of the support request.

### Use the support-bundle command

When you need to gather logs from an IoT Edge device, the easiest way is to use the `support-bundle` command. This command collects:

- Module logs
- IoT Edge security manager and container engine logs
- Iotedge check JSON output
- Useful debug information

1. Run the `support-bundle` command with the *--since* flag to specify how much time you want your logs to cover. For example, 2h will get logs for the last two hours. You can change the value of this flag to include logs for different periods.

    ```
    sudo iotedge support-bundle --since 2h
    ```

   This command creates a file named *support_bundle.zip* in the directory where you ran the command. 
   
1. Attach the *support_bundle.zip* file to the support ticket.

### Live Video Analytics debug logs

To configure the Live Video Analytics on IoT Edge module to generate debug logs, do the following:

1. Sign in to the [Azure portal](https://portal.azure.com), and go to your IoT hub.
1. On the left pane, select **IoT Edge**.
1. In the list of devices, select the ID of the target device.
1. At the top of the pane, select **Set Modules**.

   ![Screenshot of the "Set Modules" button in the Azure portal.](media/troubleshoot-how-to/set-modules.png)

1. In the **IoT Edge Modules** section, look for and select **lvaEdge**.
1. Select **Container Create Options**.
1. In the **Binds** section, add the following command:

    `/var/local/mediaservices/logs:/var/lib/azuremediaservices/logs`

    > [!NOTE] 
    > This command binds the logs folders between the Edge device and the container. If you want to collect the logs in a different location, use the following command, replacing **$LOG_LOCATION_ON_EDGE_DEVICE** with the location you want to use:
    > `/var/$LOG_LOCATION_ON_EDGE_DEVICE:/var/lib/azuremediaservices/logs`

1. Select **Update**.
1. Select **Review + Create**. A successful validation message is posted under a green banner.
1. Select **Create**.
1. Update **Module Identity Twin** to point to the DebugLogsDirectory parameter, which points to the directory in which the logs are collected:

    a. Under the **Modules** table, select **lvaEdge**.  
    b. At the top of the pane, select **Module Identity Twin**. An editable pane opens.  
    c. Under **desired key**, add the following key/value pair:  
    `"DebugLogsDirectory": "/var/lib/azuremediaservices/logs"`

    > [!NOTE] 
    > This command binds the logs folders between the Edge device and the container. If you want to collect the logs in a different location, use the following command, replacing **$DEBUG_LOG_LOCATION_ON_EDGE_DEVICE** with the location you want to use:  
    > `"DebugLogsDirectory": "/var/$DEBUG_LOG_LOCATION_ON_EDGE_DEVICE"`  

    d. Select **Save**.

1. Reproduce the issue.
1. Connect to the virtual machine from the **IoT Hub** page in the portal.
1. Zip all the files in the *debugLogs* folder.

   > [!NOTE]
   > These log files are not meant for self-diagnosis. They are meant for the Azure engineering team to analyze your issues.

   a. In the following command, be sure to replace **$DEBUG_LOG_LOCATION_ON_EDGE_DEVICE** with the location of the debug logs on the Edge device that you set up earlier.  

   ```
   sudo apt install zip unzip  
   zip -r debugLogs.zip $DEBUG_LOG_LOCATION_ON_EDGE_DEVICE 
   ```

   b. Attach the *debugLogs.zip* file to the support ticket.

1. You can stop log collection by setting the value in **Module Identity Twin** to *null*. Go back to the **Module Identity Twin** page and update the following parameter as:

    `"DebugLogsDirectory": ""`

## Next steps

[Tutorial: Event-based video recording to cloud and playback from cloud](event-based-video-recording-tutorial.md)
