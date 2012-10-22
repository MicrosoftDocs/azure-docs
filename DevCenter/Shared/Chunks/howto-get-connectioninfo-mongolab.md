When you provision a MongoLab database, we transmit a MongoDB URI to Azure. This value is used to initiate a MongoDB connection through your choice of MongoDB driver.

You can retrieve this URI in the Azure Portal using the following steps:

1. Select **Add-ons**.  
![AddonsButton][button-addons]
1. Locate your MongoLab service in your list of add-ons.  
![MongolabEntry][entry-mongolabaddon]
1. Cick the name of your add-on to reach the add-on page.
1. Click **Connection Info**  
![ConnectionInfoButton][button-connectioninfo]  
Your MongoLab URI displays:  
![ConnectionInfoScreen][screen-connectioninfo]  
1.  Click the clipboard button to the right of the MONGOLAB_URI value to copy the full value to the clipboard.

[entry-mongolabaddon]: ../Media/entry-mongolabaddon.png
[button-connectioninfo]: ../Media//button-connectioninfo.png
[screen-connectioninfo]: ../Media/dialog-mongolab_connectioninfo.png
[button-addons]: ../Media/button-addons.png