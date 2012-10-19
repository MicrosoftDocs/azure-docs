# How To: Obtain Your MongoLab Database Connection Info
When you provision a MongoLab database, we transmit a MongoDB URI to Azure. You can retrieve this URI in the Azure Portal.

1. Select **Add-ons**.  
![AddonsButton][button-addons]
1. Locate your MongoLab service in your list of add-ons.  
![MongolabEntry][entry-mongolabaddon]
1. Cick the name of your add-on to reach the add-on page.
1. Click **Connection Info**  
![ConnectionInfoButton][button-connectioninfo]  
Your MongoLab URI displays:  
![ConnectionInfoScreen][screen-connectioninfo]  
1.  Click the clipboard button to the right of the MONGOLAB_URI value to copy this value to the clipboard. 

[entry-mongolabaddon]: ../Media/MongoLab/entry-mongolabaddon.png
[button-connectioninfo]: ../Media/MongoLab/button-connectioninfo.png
[screen-connectioninfo]: ../Media/MongoLab/dialog-mongolab_connectioninfo.png
[button-addons]: ../Media/MongoLab/button-addons.png