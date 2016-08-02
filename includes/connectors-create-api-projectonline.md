### Prerequisites
- A [ProjectOnline](https://products.office.com/Project/project-online-with-project-for-office-365) account 

Before you can use your ProjectOnline account in a Logic app, you must authorize the Logic app to connect to your ProjectOnline account. Fortunately, you can do this easily from within your Logic app on the Azure Portal. 

Here are the steps to authorize your Logic app to connect to your ProjectOnline account:

1. To create a connection to ProjectOnline, in the Logic app designer, select **Show Microsoft managed APIs** in the drop down list then enter *ProjectOnline* in the search box. Select the trigger or action you'll like to use:  
  ![ProjectOnline step 1](./media/connectors-create-api-projectonline/projectonline-1.png)
2. If you haven't created any connections to ProjectOnline before, you'll get prompted to provide your ProjectOnline credentials. These credentials will be used to authorize your Logic app to connect to, and access your ProjectOnline account's data:  
  ![ProjectOnline step 2](./media/connectors-create-api-projectonline/projectonline-2.png)
3. Provide your ProjectOnline user name and password to authorize your Logic app:  
  ![ProjectOnline step 3](./media/connectors-create-api-projectonline/projectonline-3.png)   
4. Notice the connection has been created and you are now free to proceed with the other steps in your Logic app:  
  ![ProjectOnline step 4](./media/connectors-create-api-projectonline/projectonline-4.png)   
