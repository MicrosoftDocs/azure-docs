1. Log on to the Azure classic portal.

2. In the left navigation pane of the portal, click **Service Bus**.

3. In the lower pane of the portal, click **Create**.

    ![Select Create][select-create]
   
4. In the **Add a new namespace** dialog, enter a namespace name. The system immediately checks to see if the name is available.

    ![Namespace name][namespace-name]
  
5. After making sure the namespace name is available, choose the country or region in which your namespace should be hosted.

6. Leave the other fields in the dialog with their default values (**Messaging** and **Standard Tier**), then click the OK check mark. The system now creates your namespace and enables it. You might have to wait several minutes as the system provisions resources for your account.
 
    ![Created successfully][created-successfully]

###Obtain the credentials
1. In the left navigation pane, click the **Service Bus** node, to display the list of available namespaces:
 
    ![Select service bus][select-service-bus]
  
2. Select the namespace you just created from the list shown:
 
    ![Select namespace][select-namespace]
 
3. Click **Connection Information**.

    ![Connection information][connection-information]
  
4. In the **Access connection information** pane, find the connection string that contains the SAS key and key name.

    ![Access connection information][access-connection-information]
  
5. Make a note of the key, or copy it to the clipboard.

<!--Image references-->

[select-create]: ./media/service-bus-create-namespace-portal/select-create.png
[namespace-name]: ./media/service-bus-create-namespace-portal/namespace-name.png
[created-successfully]: ./media/service-bus-create-namespace-portal/created-successfully.png
[select-service-bus]: ./media/service-bus-create-namespace-portal/select-service-bus.png
[select-namespace]: ./media/service-bus-create-namespace-portal/select-namespace.png
[connection-information]: ./media/service-bus-create-namespace-portal/connection-information.png
[access-connection-information]: ./media/service-bus-create-namespace-portal/access-connection-information.png


<!--Reference style links - using these makes the source content way more readable than using inline links-->
[classic-portal]: https://manage.windowsazure.com