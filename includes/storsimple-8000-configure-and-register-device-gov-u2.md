---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

### To configure and register the device
1. Access the Windows PowerShell interface on your StorSimple device serial console. See [Use PuTTY to connect to the device serial console](../articles/storsimple/storsimple-8000-deployment-walkthrough-gov-u2.md#use-putty-to-connect-to-the-device-serial-console) for instructions. **Be sure to follow the procedure exactly or you will not be able to access the console.**
2. In the session that opens up, press **Enter** one time to get a command prompt.
3. You will be prompted to choose the language that you would like to set for your device. Specify the language, and then press **Enter**.
   
    ![StorSimple configure and register device 1](./media/storsimple-configure-and-register-device-gov-u2/HCS_RegisterYourDevice1-gov-include.png)
4. In the serial console menu that is presented, choose option 1, **Log in with full access**.
   
    ![StorSimple register device 2](./media/storsimple-configure-and-register-device-gov-u2/HCS_RegisterYourDevice2-gov-include.png)
5. Perform the following steps to configure the minimum required network settings for your device.
   
   > [!IMPORTANT]
   > These configuration steps need to be performed on the active controller of the device. The serial console menu indicates the controller state in the banner message. If you are not connect to the active controller, disconnect and then connect to the active controller.
   
   1. At the command prompt, type your password. The default device password is **Password1**.
   2. Type the following command:
      
        `Invoke-HcsSetupWizard`
   3. A setup wizard will appear to help you configure the network settings for the device. Supply the following information:
      
      * IP address for DATA 0 network interface
      * Subnet mask
      * Gateway
      * IP address for Primary DNS server
      * IP address for Primary NTP server
      
      > [!NOTE]
      > You may have to wait for a few minutes for the subnet mask and DNS settings to be applied.
    
   4. Optionally, configure your web proxy server.
      
      > [!IMPORTANT]
      > Although web proxy configuration is optional, be aware that if you use a web proxy, you can only configure it here. For more information, go to [Configure web proxy for your device](../articles/storsimple/storsimple-8000-configure-web-proxy.md).
     
6. Press Ctrl + C to exit the setup wizard.
8. Run the following cmdlet to point the device to the Microsoft Azure Government portal (because it points to the public Azure classic portal by default). This will restart both controllers. We recommend that you use two PuTTY sessions to simultaneously connect to both controllers so that you can see when each controller is restarted.
   
    `Set-CloudPlatform -AzureGovt_US`
   
   You will see a confirmation message. Accept the default (**Y**).
9. Run the following cmdlet to resume setup:
   
    `Invoke-HcsSetupWizard`
   
    ![Resume setup wizard](./media/storsimple-configure-and-register-device-gov-u2/HCS_ResumeSetup-gov-include.png)
   
10. Accept the network settings. You will see a validation message after you accept each setting.
11. For security reasons, the device administrator password expires after the first session, and you will need to change it now. When prompted, provide a device administrator password. A valid device administrator password must be between 8 and 15 characters. The password must contain three of the following: lowercase, uppercase, numeric, and special characters.
    
    <br/>![StorSimple register device 5](./media/storsimple-configure-and-register-device-gov-u2/HCS_RegisterYourDevice5_gov-include.png)
12. The final step in the setup wizard registers your device with the StorSimple Device Manager service. For this, you will need the service registration key that you obtained in [Step 2: Get the service registration key](../articles/storsimple/storsimple-8000-deployment-walkthrough-gov-u2.md#step-2-get-the-service-registration-key). After you supply the registration key, you may need to wait for 2-3 minutes before the device is registered.
    
    > [!NOTE]
    > You can press Ctrl + C at any time to exit the setup wizard. If you have entered all the network settings (IP address for Data 0, Subnet mask, and Gateway), your entries will be retained.
    
    ![StorSimple registration progress](./media/storsimple-configure-and-register-device-gov-u2/HCS_RegistrationProgress-gov-include.png)
13. After the device is registered, a Service Data Encryption key will appear. Copy this key and save it in a safe location. **This key is required with the service registration key to register additional devices with the StorSimple Device Manager service.** Refer to [StorSimple security](../articles/storsimple/storsimple-8000-security.md) for more information about this key.
    
    ![StorSimple register device 7](./media/storsimple-configure-and-register-device-gov-u2/HCS_RegisterYourDevice7_gov-include.png)
    > [!IMPORTANT]
    > To copy the text from the serial console window, simply select the text. You should then be able to paste it in the clipboard or any text editor.
    > 
    > DO NOT use **Ctrl + C** to copy the service data encryption key. Using **Ctrl + C** will cause you to exit the setup wizard. As a result, the device administrator password will not be changed and the device will revert to the default password.
    
14. Exit the serial console.
15. Return to the Azure Government Portal, and complete the following steps:
    
    1. Go to your StorSimple Device Manager service.
    2. Click **Devices**. From the list of devices, identify the device that you are deploying. Verify that the device has successfully connected to the service by looking up the status. The device status should be **Online**.
            
        If the device status is **Offline**, wait for a couple of minutes for the device to come online.
       
        If the device is still offline after a few minutes, then you need to make sure that your firewall network was configured as described in [networking requirements for your StorSimple device](../articles/storsimple/storsimple-8000-system-requirements.md).
       
        Verify that port 9354 is open for outbound communication as this is used by the service bus for StorSimple Device Manager Service-to-device communication.