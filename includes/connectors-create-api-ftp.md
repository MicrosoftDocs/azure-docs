### Prerequisites

- An [FTP](https://wikipedia.org/wiki/File_Transfer_Protocol) account  


Before you can use your FTP account in a logic app, you must authorize the logic app to connect to your FTP account.Fortunately, you can do this easily from within your logic app on the Azure Portal.  

Here are the steps to authorize your logic app to connect to your FTP account:  
1. To create a connection to FTP, in the logic app designer, select **Show Microsoft managed APIs** in the drop down list then enter *FTP* in the search box. Select the trigger or action you'll like to use:  
![FTP connection creation step](./media/connectors-create-api-ftp/ftp-1.png)  
2. If you haven't created any connections to FTP before, you'll get prompted to provide your FTP credentials. These credentials will be used to authorize your logic app to connect to, and access your FTP account's data:  
![FTP connection creation step](./media/connectors-create-api-ftp/ftp-2.png)  
3. Notice the connection has been created and you are now free to proceed with the other steps in your logic app:  
 ![FTP connection creation step](./media/connectors-create-api-ftp/ftp-3.png)  
