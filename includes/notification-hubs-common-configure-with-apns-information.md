---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

### Configure your notification hub with APNS information

Under **Notification Services**, select **Apple** then follow the appropriate steps based on the approach you chose previously in the [Creating a Certificate for Notification Hubs](#creating-a-certificate-for-notification-hubs) section.  

> [!NOTE]
> Use the **Production** for **Application Mode** only if you want to send push notifications to users who purchased your app from the store.

### OPTION 1: Using a .p12 push certificate

1. Select **Certificate**.

1. Select the file icon.

1. Select the .p12 file that you exported earlier, and then select **Open**.

1. If necessary, specify the correct password.

1. Select **Sandbox** mode.

1. Select **Save**.

### OPTION 2: Using token-based authentication

1. Select **Token**.
1. Enter the following values that you acquired earlier:

    - **Key ID**
    - **Bundle ID**
    - **Team ID**
    - **Token**

1. Choose **Sandbox**.
1. Select **Save**.
