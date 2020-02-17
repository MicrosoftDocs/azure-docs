---
title: Transform XML between formats
description: Create transforms or maps that convert XML between formats in Azure Logic Apps with Enterprise Integration Pack
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, logicappspm
ms.topic: article
ms.date: 07/08/2016
---

# Create maps that transform XML between formats in Azure Logic Apps with Enterprise Integration Pack

The Enterprise integration Transform connector converts data from one format to another format. For example, you may have an incoming message that contains the current date in the YearMonthDay format. You can use a transform to reformat the date to be in the MonthDayYear format.

## What does a transform do?
A Transform, which is also known as a map, consists of a Source XML schema (the input) and a Target XML schema (the output). You can use different built-in functions to help manipulate or control the data, including string manipulations, conditional assignments, arithmetic expressions, date time formatters, and even looping constructs.

## How to create a transform?
You can create a transform/map by using the Visual Studio [Enterprise Integration SDK](https://aka.ms/vsmapsandschemas). When you are finished creating and testing the transform, you upload the transform into your integration account. 

## How to use a transform
After you upload the transform/map into your integration account, you can use it to create a Logic app. The Logic app runs your transformations whenever the Logic app is triggered (and there is input content that needs to be transformed).

**Here are the steps to use a transform**:

### Prerequisites

* Create an integration account and add a map to it  

Now that you've taken care of the prerequisites, it's time to create your Logic app:  

1. Create a Logic app and [link it to your integration account](../logic-apps/logic-apps-enterprise-integration-accounts.md "Learn to link an integration account to a Logic app") that contains the map.
2. Add a **Request** trigger to your Logic app  
   ![](./media/logic-apps-enterprise-integration-transforms/transform-1.png)    
3. Add the **Transform XML** action by first selecting **Add an action**   
   ![](./media/logic-apps-enterprise-integration-transforms/transform-2.png)   
4. Enter the word *transform* in the search box to filter all the actions to the one that you want to use  
   ![](./media/logic-apps-enterprise-integration-transforms/transform-3.png)  
5. Select the **Transform XML** action   
6. Add the XML **CONTENT** that you transform. You can use any XML data you receive in the HTTP request as the **CONTENT**. In this example, select the body of the HTTP request that triggered the Logic app.

   > [!NOTE]
   > Make sure that the content for the **Transform XML** is XML. 
   > If the content is not in XML or is base64-encoded, 
   > you must specify an expression that processes the content. 
   > For example, you can use [functions](logic-apps-workflow-definition-language.md#functions), 
   > like ```@base64ToBinary``` for decoding content or ```@xml``` for processing the content as XML.
 

7. Select the name of the **MAP** that you want to use to perform the transformation. The map must already be in your integration account. In an earlier step, you already gave your Logic app access to your integration account that contains your map.      
   ![](./media/logic-apps-enterprise-integration-transforms/transform-4.png) 
8. Save your work  
    ![](./media/logic-apps-enterprise-integration-transforms/transform-5.png) 

At this point, you are finished setting up your map. In a real world application, you may want to store the transformed data in an LOB application such as SalesForce. You can easily as an action to send the output of the transform to Salesforce. 

You can now test your transform by making a request to the HTTP endpoint.  


## Features and use cases
* The transformation created in a map can be simple, such as copying a name and address from one document to another. Or, you can create more complex transformations using the out-of-the-box map operations.  
* Multiple map operations or functions are readily available, including strings, date time functions, and so on.  
* You can do a direct data copy between the schemas. In the Mapper included in the SDK, this is as simple as drawing a line that connects the elements in the source schema with their counterparts in the destination schema.  
* When creating a map, you view a graphical representation of the map, which shows all the relationships and links you create.
* Use the Test Map feature to add a sample XML message. With a simple click, you can test the map you created, and see the generated output.  
* Upload existing maps  
* Includes support for the XML format.

## Advanced features

### Reference assembly or custom code from maps 
The transform action also supports maps or transforms with reference to external assembly. This capability enables calls to custom .NET code directly from XSLT maps. Here are the prerequisites to use assembly in maps.

* The map and the assembly referenced from the map needs to be [uploaded to integration account](./logic-apps-enterprise-integration-maps.md). 

  > [!NOTE]
  > Map and assembly are required to be uploaded in a specific order. You must upload the assembly before you upload the map that references the assembly.

* The map must also have these attributes and a CDATA section that contains the call to the assembly code:

    * **name** is the custom assembly name.
    * **namespace** is the namespace in your assembly that includes the custom code.

  This example shows a map that references an assembly named "XslUtilitiesLib" and calls the `circumreference` method from the assembly.

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:user="urn:my-scripts">
  <msxsl:script language="C#" implements-prefix="user">
    <msxsl:assembly name="XsltHelperLib"/>
    <msxsl:using namespace="XsltHelpers"/>
    <![CDATA[public double circumference(int radius){ XsltHelper helper = new XsltHelper(); return helper.circumference(radius); }]]>
  </msxsl:script>
  <xsl:template match="data">
	 <circles>
		<xsl:for-each select="circle">
			<circle>
				<xsl:copy-of select="node()"/>
					<circumference>
						<xsl:value-of select="user:circumference(radius)"/>
					</circumference>
			</circle>
		</xsl:for-each>
	 </circles>
	</xsl:template>
    </xsl:stylesheet>
  ```


### Byte Order Mark
By default, the response from the transformation starts with the Byte Order Mark (BOM). You can access this functionality only while working in the Code View editor. To disable this functionality, specify `disableByteOrderMark` for the `transformOptions` property:

```json
"Transform_XML": {
    "inputs": {
        "content": "@{triggerBody()}",
        "integrationAccount": {
            "map": {
                "name": "TestMap"
            }
        },
        "transformOptions": "disableByteOrderMark"
    },
    "runAfter": {},
    "type": "Xslt"
}
```





## Learn more
* [Learn more about the Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")  
* [Learn more about maps](../logic-apps/logic-apps-enterprise-integration-maps.md "Learn about enterprise integration maps")  

