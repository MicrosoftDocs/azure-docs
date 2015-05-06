## Review API app metadata

The metadata that enables a Web API project to be deployed as an API app is contained in an *apiapp.json* file and a *Metadata* folder.

![](./media/app-service-api-review-metadata/metadatainse.png)

The default contents of the *apiapp.json* file resemble the following example:

		{
		    "$schema": "http://json-schema.org/schemas/2014-11-01/apiapp.json#",
		    "id": "ContactsList",
		    "namespace": "microsoft.com",
		    "gateway": "2015-01-14",
		    "version": "1.0.0",
		    "title": "ContactsList",
		    "summary": "",
		    "author": "",
		    "endpoints": {
		        "apiDefinition": "/swagger/docs/v1",
		        "status": null
		    }
		}

For this tutorial you can accept the defaults. The [API app metadata](#api-app-metadata) section later in the tutorial explains how to customize this metadata.