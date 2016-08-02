### Prerequisites

- A [box](http://box.com) account  


Before you can use your box account in a Logic app, you must authorize the Logic app to connect to your box account.Fortunately, you can do this easily from within your Logic app on the Azure Portal.  

Here are the steps to authorize your Logic app to connect to your box account:  
1. To create a connection to box, in the Logic app designer, select **Show Microsoft managed APIs** in the drop down list then enter *box* in the search box. Select the trigger or action you'll like to use:  
![box connection creation step](./media/connectors-create-api-box/box-1.png)  
2. If you haven't created any connections to box before, you'll get prompted to provide your box credentials. These credentials will be used to authorize your Logic app to connect to, and access your box account's data:  
![box connection creation step](./media/connectors-create-api-box/box-2.png)  
3. Provide your box user name and password to authorize your Logic app:  
 ![box connection creation step](./media/connectors-create-api-box/box-3.png)  
4. Allow us to connect to box:  
![box connection creation step](./media/connectors-create-api-box/box-4.png)  
5. Notice the connection has been created and you are now free to proceed with the other steps in your Logic app:  
![box connection creation step](./media/connectors-create-api-box/box-5.png)  
