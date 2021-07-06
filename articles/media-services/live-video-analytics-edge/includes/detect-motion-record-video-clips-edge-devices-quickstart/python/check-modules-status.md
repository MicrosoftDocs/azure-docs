In the [Generate and deploy the IoT Edge deployment manifest](../../../detect-motion-emit-events-quickstart.md#generate-and-deploy-the-deployment-manifest) step, in Visual Studio Code, expand the **lva-sample-device** node under **AZURE IOT HUB** (in the lower-left section). You should see the following modules deployed:

* The Live Video Analytics module, named `lvaEdge`
* The `rtspsim` module, which simulates an RTSP server that acts as the source of a live video feed

  ![Modules](../../../media/quickstarts/lva-sample-device-node.png)

> [!NOTE]
> The above steps are assuming you are using the virtual machine created by the setup script. If you are using your own edge device instead, go to your edge device and run the following commands with **admin rights**, to pull and store the sample video file used for this quickstart:  

```
mkdir /home/lvaedgeuser/samples
mkdir /home/lvaedgeuser/samples/input    
curl https://lvamedia.blob.core.windows.net/public/camera-300s.mkv > /home/lvaedgeuser/samples/input/camera-300s.mkv  
chown -R lvalvaedgeuser:localusergroup /home/lvaedgeuser/samples/  
```
