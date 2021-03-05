---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 12/07/2018
ms.author: alkohli
---

1. Sign into the Data Box device. Ensure it is unlocked.

    ![Screenshot shows your dashboard with the device displayed as Unlocked.](media/data-box-add-device-ip/data-box-connect-via-rest-1.png)

2. Go to **Set network interfaces**. Make a note of the device IP address for the network interface used to connect to the client.

    ![Screenshot shows the Network Settings where you can see the I P address.](media/data-box-add-device-ip/data-box-connect-via-rest-2.png)

3. Go to **Connect and copy** and click **Rest**.

    ![Screenshot shows the Connect and copy pane where you can select REST as an access setting.](media/data-box-add-device-ip/data-box-connect-via-rest-3.png)

4. From the **Access Storage account and upload data** dialog, copy the **Blob Service Endpoint**.

    ![Screenshot shows the Access storage account and upload data dialog box where you can copy the Blob Service Endpoint.](media/data-box-add-device-ip/data-box-connect-via-rest-4.png)

5. Start **Notepad** as an administrator, and then open the **hosts** file located at `C:\Windows\System32\Drivers\etc`.
6. Add the following entry to your **hosts** file: `<device IP address> <Blob service endpoint>`
7. For reference, use the following image. Save the **hosts** file.

    ![Screenshot shows a Notepad document with the I P address and blob service endpoint added.](media/data-box-add-device-ip/data-box-connect-via-rest-5.png)
