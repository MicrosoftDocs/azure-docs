In the [Generate and deploy the IoT Edge deployment manifest](../../../detect-motion-emit-events-quickstart.md#generate-and-deploy-the-deployment-manifest) step, in Visual Studio Code, expand the **lva-sample-device** node under **AZURE IOT HUB** (in the lower-left section). You should see the following modules deployed:

* The Live Video Analytics module, named `lvaEdge`
* The `rtspsim` module, which simulates an RTSP server that acts as the source of a live video feed

  ![Modules](../../../media/quickstarts/lva-sample-device-node.png)

> [!NOTE]
> If you are using your own edge device instead of the one provisioned by our setup script, go to your edge device and run the following commands with **admin rights**, to pull and store the sample video file used for this quickstart:  

```
mkdir /home/lvaadmin/samples
mkdir /home/lvaadmin/samples/input    
curl https://lvamedia.blob.core.windows.net/public/camera-300s.mkv > /home/lvaadmin/samples/input/camera-300s.mkv  
chown -R lvaadmin /home/lvaadmin/samples/  
```
