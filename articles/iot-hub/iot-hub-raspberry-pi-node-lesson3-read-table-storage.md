# 3.3 Read messages persisted in Azure Storage

## 3.3.1 What you will do
Monitor the device-to-cloud messages as they are written to your Azure storage.

## 3.3.2 What you will learn
- How to use gulp read-message task to read messages persisted in your Azure storage account.

### 3.3.3 What you need
- You must have successfully completed the previous section, Run the Azure blink sample application on your Raspberry Pi 3.

### 3.3.4 Read new messages from your Azure storage account
In previous section, you executed the sample application on your Raspberry Pi 3 that sent messages to your Azure IoT hub. The messages sent to IoT hub will be stored into your Azure table storage via your Azure function app. Run the following command to send messages again and read them from your table storage.

```bash
gulp run --read-storage
```

![glup run --read-storage](media/iot-hub-raspberry-pi-lessons/lesson3/gulp_read_message.png)

### 3.3.5 Summary
You have now successfully connected your Raspberry Pi 3 device to the cloud and used the Azure blink sample application to send device-to-cloud messages. You also used the Azure function app to persist incoming IoT hub messages to your Azure table storage. Now you can move to the next lesson to send cloud-to-device messages to your Raspberry Pi 3.

