### Prerequisites

- An [SFTP](https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol) account  


Before you can use your SFTP account in a logic app, you must authorize the logic app to connect to your SFTP account. Fortunately, you can do this easily from within your logic app on the Azure Portal.  

Here are the steps to authorize your logic app to connect to your SFTP account:  
1. To create a connection to SFTP, in the logic app designer, select **Show Microsoft managed APIs** in the drop down list then enter *SFTP* in the search box. Select the **SFTP - When a file is added or modified** trigger:  
![SFTP online connection image 1](./media/connectors-create-api-sftp/sftp-1.png)  
2. If you haven't created any connections to SFTP before, you'll get prompted to provide your SFTP credentials. These credentials will be used to authorize your logic app to connect to, and access your SFTP account's data:  
![SFTP online connection image 2](./media/connectors-create-api-sftp/sftp-2.png)  
3. Notice the connection has been created and you are now free to proceed with the other steps in your logic app:   
 ![SFTP online connection image 3](./media/connectors-create-api-sftp/sftp-3.png) 
