## Prerequisites

  - Powerapps
  - Flow
  - Office Online apps

## Configuration 

There's a lot of setup for this. That said, it's a good chance to familiarize yourself with custom Azure Apps, Connectors, Graph, and Flow


### Create the custom app to connect to Graph

- Go to "Azure Portal > Azure Active Directory > App Registrations", and click "New Registration"
- Give it a good name, eg. Graph DevMgr
- For "Supported Account Types", select "Accounts in this Organizational Directory only"
- Leave "RedirectURI" blank for now
- Take note of the "Application ID" listed in the "Overview" Pane, then go to "Azure Acitve Directory > App Registrations > Graph DevMgr > Certificates and secrets"
- Create a new client secret, take note of it
- Go to "Azure Acitve Directory > App Registrations > Graph DevMgr > API Permissions"
- Click "Add a permission", then "Microsoft Graph", then "Delegated Permissions"
- Under "Directory", check "Directory.AccessAsUser.All", "Directory.Read.All", "Directory.ReadWrite.All", then click "Add Permissions"
- At the bottom of the API Permissions page, click "Grant admin consent for <Tenant>"


### Create the custom connector

Go to "Powerapps > Data > Custom Connectors" and create a "New Custom Connector" from "blank".


#### General Tab

- Give it a good description, select "HTTPS" for the "Scheme", then enter the following for the "Host":
	- graph.microsoft.com
- For the "Base URL", enter the following:
	- /


#### Security

- For the "Authentication Type", select "OAuth 2.0", this will display the rest of the form
- For the "Identity Provider", select "Azure Active Directory"
- For "Client ID", enter the Application ID noted earlier
- For "Client Secret", enter the secret noted earlier
- Leave "Login URL" and "Tenant ID" as-is.
- For "Resource URL", enter https://graph.microsoft.com
- For "Scope", you can leave it blank
- "Redirect URL" is a value generated at connector creation. In the upper-right, click "Create Connector". 
- Scroll down to "Redirect URL", take note of it


### Linking the app and connector

- Go to "Azure Portal > Azure Active Directory > App Registrations"
- Under "Redirect URIs", select type "Web" and enter the Redirect URL noted after creating the connector
- Click Save


### Creating the connector functions

- Go back to "Flow > Custom Connectors", then click the pencil next to the custom connector
- Go the the 3rd page, "Definition"


#### Creating getDevices

- Under "Actions", click "New Action"
- For "Summary", enter "getDevices"
- Fill "Description" with something descriptive
- For "Operation ID", enter "getDevices"

- Under "Request", click "Import from Sample"
- For "Verb", select GET
- For "URL", enter the following:
	- https://graph.microsoft.com/v1.0/devices/
- Click "Import"

- Under "Response", click "Import from Sample"
- Paste the following in Body and import:
```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#devices(displayName,id,approximateLastSignInDateTime,accountEnabled)",
    "value": [
        {
            "displayName": "DEVICENAME",
            "id": "0a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a",
            "approximateLastSignInDateTime": "1999-01-01T00:00:00Z",
            "accountEnabled": true
        },
        {
            "displayName": "DEVICENAME",
            "id": "0a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a",
            "approximateLastSignInDateTime": "1999-01-01T00:00:00Z",
            "accountEnabled": true 
        }
    ]
}
```


#### Creating deleteDevice

- Under "Actions", click "New Action"
- For "Summary", enter "deleteDevice"
- Fill "Description" with something descriptive
- For "Operation ID", enter "deleteDevice"
- Under "Request", click "Import from Sample"
- For "Verb", select "DELETE"
- For "URL", enter the following:
	- https://graph.microsoft.com/v1.0/devices/{id}
- Click "Import"
- Click "Update Connector" to save our new actions.


#### Creating a connection and testing the functions

- In "PowerApps > Data > Custom Connectors > Graph DevMgmt > Test", click "New Connection"
- Sign in with user credentials that have device management rights (probably the one that'll host the Flow job)
- This should redirect you to the "Connections" page. Go back to "Custom Connectors > Graph DevMgmt > Test"
- Under "Operations", select "getDevices", then click "Test Operation"
- Under "Response" you should see the returned devices. Take note of the "ID" (not "deviceID", "ID" proper) of a test device - we'll delete it with the "deleteDevice" function.
- Under "Operations", click "deleteDevice", then enter the noted "ID", then click "Test Operation"
- Under "Operations", click "getDevices" and "Test Operation" and validate that the device has been deleted


## Testing

Before we start deleting devices, let's make sure they identify correctly.


### Create the table to log data

- Create a new Excel Workbook in OneDrive - this should open in Excel Online
- On the first sheet, in the first row, enter the following column headers:
	- Name, ID, LastLogon, Enabled, State, NewState
- Select these 5 cells (A1:F1), then click "Insert > Table" 
- Check "My table has headers" then click OK


### Logging Flow

#### Creating the blank Flow

- Go to "Flow > Create"
- Click "Scheduled Flow"
- Give the Flow a Name, eg "StaleDevFlow"
- Set your preferred cycle, eg. start on Monday at midnight, repeat every month (this may not work for your organization - find a cycle that works for you)
- Click "Create", this should bring you to the Flow designer


#### Fetching the devices and enumerating

- Click New Step under Choose an Action, go to Custom, then click Graph DevMgmt
- Click "getDevices". This adds the getDevices action to the Flow
- Click "New Step > Built-in > Control" and click "Apply to Each"
- Click on the "Select an output from previous steps" field, then in the pane that appears, click "Dynamic Content > getDevices > value"


#### Filtering the device list

- In the "Apply to each", click "Add an Action"
- Add "Built-in > Control > Condition"
- Click the left-hand "Choose a value" field, in the pane that opens select "Dynamic Content > getDevices > approximateLastSignInDateTime"
- Leave "is equal to" as the comparision, click the right-hand "Choose a value" 
- Switch to the Expression tab, start typing "null", and click the option that appears in the dropdown
- In the "No" box, click "Add an action"
- Add "Built-in > Control > Condition"
- Click the left-hand "Choose a value" field, in the pane that opens select "Dynamic Content > getDevices > approximateLastSignInDateTime"
- Set the comparision to "is less than", click the right-hand "Choose a value".
- Switch to the "Expression" tab, enter the following then click ok:
	- addDays(utcNow(),-30)
- With this, the flow will go through each item, and for each, evaluate first if it's null, then if it's stale.


#### Logging the current state

##### Logging the Nulls

- In the "yes" of the first conditional (is equal to null) click "Add an action"
- Under "Standard > Excel Online (Business)", click "Add a row into a table"
- For Location, select "OneDrive", which should also populate the "Document Library" field
- Click on the File field and pick the log file we created earlier
- There should only be one Table listed, select it
- Click the Name field, and in the pane that pops up, select Dynamic Content > getDevices > displayName
- Click the ID field, select Dynamic Content > getDevices > id 
- Click the LastLogon field, select Dynamic Content > getDevices > approximateLastSignInDateTime
- Click the Enabled field, select Dynamic Content > getDevices > enabled
- In the State field, enter the string Empty
- Same for the New State


##### Logging the expired

- In the "yes" of the first conditional (is less than utcnow-30) click "Add an action"
- Under "Standard > Excel Online (Business)", click "Add a row into a table"
- For Location, select "OneDrive", which should also populate the "Document Library" field
- Click on the File field and pick the log file we created earlier
- There should only be one Table listed, select it
- Click the Name field, and in the pane that pops up, select Dynamic Content > getDevices > displayName
- Click the ID field, select Dynamic Content > getDevices > id 
- Click the LastLogon field, select Dynamic Content > getDevices > approximateLastSignInDateTime
- Click the Enabled field, select Dynamic Content > getDevices > enabled
- In the State field, enter the string Expired
- In the New State field, enter the string Deleted
- Save the flow and test it - after it ran, the excel file should contain the null and expired devices
- Validate the data to confirm the logic is flowing as expected


## Setting up the deletion

Once you've confirmed it's targeting the correct devices, add the delete action

### Deleting the expired

- Under the previous "Add a row into a table" (the one that executes when less than utcnow-30), click "Add Action"
- Under "Custom > Graph DevMgr" click deleteDevice
- In the action pane, click the id field and select Dynamic Content > getDevices > id
- Save the flow and execute - it will go through and delete the devices
