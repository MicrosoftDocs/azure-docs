<properties 
   pageTitle="BizTalk Rules" 
   description="This topic covers the features of BizTalk Rules and provides instructions on its usage" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="anuragdalmia" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="02/27/2015"
   ms.author="andalmia"/>

#BizTalk Rules 

Business Rules encapsulates the policies and decisions that control business processes. These policies may be formally defined in procedure manuals, contracts, or agreements, or may exist as knowledge or expertise embodied in employees. These policies are dynamic and subject to change over time due to changes in business plans, regulations or other reasons.

Implementing these policies in traditional programming languages requires substantial time and coordination, and does not enable non-programmers to participate in creation and maintenance of business policies. BizTalk Business Rules provides a way to rapidly implement these policies and decouple the rest of the business process. This allows for making required changes to business policies without impacting the rest of the business process.

##Why Rules

There are 3 key reasons to use BizTalk Business Rules in business process:

* Decouple Business logic from Application code
- Allow Business Analysts to have more control over business logic management
+ Changes to business logic go to production faster

#Rules Concepts

##Vocabulary

The terms used to define rule conditions and actions are usually expressed by domain or industry-specific nomenclature. For example, an e-mail user writes rules in terms of messages "received from" and messages "received after," while an insurance business analyst writes rules in terms of "risk factors" and "coverage amount."
Underlying this domain-specific terminology are the technology artifacts (objects, database tables, and XML documents) that implement rule conditions and rule actions. Vocabularies are designed to bridge the gap between business semantics and implementation.

For example, a data binding for an approval status might point to a certain column in a certain row in a certain database, represented as an SQL query. Instead of inserting this sort of complex representation in a rule, you might instead create a vocabulary definition, associated with that data binding, with a friendly name of "Status." Subsequently you can include "Status" in any number of rules, and the rule engine can retrieve the corresponding data from the table.
A _vocabulary_ is a collection of definitions consisting of friendly names for the computing objects used in rule conditions and actions. Vocabulary definitions make the rules easier to read, understand, and share by people in a particular business domain.

##Rule

Business rules are declarative statements that govern the conduct of business processes. A rule consists of a condition and actions. The condition is evaluated, and if it evaluates to true, the rule engine initiates one or more actions.
Rules in the Business Rules Framework are defined by using the following format:

_IF_ _condition_ _THEN_ _action_

Consider the following example:

*IF amount is less than or equal to available funds*  
*THEN conduct transaction and print receipt*

This rule determines whether a transaction will be conducted by applying business logic, in the form of a comparison of two monetary values, in the form of a transaction amount and available funds.
You can use the Business Rule to create, modify, and deploy business rules. Alternatively, you can perform the preceding tasks programmatically.

###Conditions

A condition is a true/false (Boolean) expression that consists of one or more predicates.
In our example, the predicate less than or equal to is applied to the amount and available funds. This condition will always evaluate to either true or false.
Predicates can be combined with the logical operators AND, OR, and NOT to form a logical expression that is potentially quite large, but will always evaluate to either true or false.

###Actions

Actions are the functional consequences of condition evaluation. If a rule condition is met, a corresponding action or actions are initiated.
In our example, "conduct transaction" and "print receipt" are actions that are carried out when, and only when, the condition (in this case, "IF amount is less than or equal to available funds") is true.
Actions are represented in the Business Rules Framework by performing set operations on XML documents.

##Policy

A policy is a logical grouping of rules. You compose a policy, save it, test it and, when you are satisfied with the results, use it in a production environment.

###Policy composition

You can compose policies in the Rules portal. A policy can contain an arbitrarily large set of rules, but typically you compose a policy from rules that pertain to a specific business domain within the context of the application that will be using the policy.

###Policy testing
You can effectively perform a test run of your policy before it is used in a production environment. The Rules Portal allows you to supply inputs to a policy, run the policy, and view its output. The output includes logs, rule execution, condition evaluation, and resulting outputs.

##Sample Scenario - Insurance Claims
Let’s take a sample scenario and walk through it as we compose the Business Logic for the same.

![Alt text][1]

In a really simple Insurance Claims scenario, the Claimant submits his insurance claim (via any client like website, phone App, etc). This Claim Request gets sent to the business’s Claim Processing Unit and based on the result of the processing, the Claim can be either Approved, Rejected or sent along for further manual processing.
The Claim Processing Unit in our scenario would be the one encompassing the Business logic for the system. Taking a closer look at this unit, we can see the following:

![Alt text][2]
 
Let us now use Business Rules to implement this business logic.


##Creation of Rules Api App


1. Login to the Azure Portal and get to the home page. 
1. Click on New->Azure Marketplace->API Apps->Biz Talk Rules->Create
![Alt text][3]
1. In the new blade that opens, enter the following information:  
	1. Name – give a name for your Rules API App
	1. App Hosting Plan – select or create a web hosting plan
	1. Pricing Tier – Choose the pricing tier you want this App to reside in
	1. Resource Group – Select or create Resource group where the App should reside in
	1. Location – Choose the geographic location where you would like the App to be deployed.
4.	Click on Create. Within a few minutes your BizTalk Rules API App would be created.

##Vocabulary Creation
After creating a BizTalk Rules API App, the next step would be to create vocabularies. The expectation is that the developer is the more common persona to be doing this exercise. To do this follow the following steps: 


1. Browse to the created API App by Browse->API Apps-><Your Rules API App>. This should get you to the Rules API App Dashboard similar to below:
 
   ![Alt text][4]

2.Next Click on “Vocabulary definitions”. This would show you the Vocabulary Authoring Screen. Click on “Add” to begin adding new vocabulary definitions.
There are 2 types of vocabulary definitions currently supported – Literal and XML.

##Literal Definition
1.	After clicking on “Add”, a new “Add Definition” Blade Opens up. Enter the following values
  1.	Name – only alphanumeric characters are expected without any special characters. This should also be unique to your existing vocabulary definition list.
  2.	Description – optional field.
  3.	Type – there are 2 types supported. Choose Literal in this example
  4.	Input type – this allows users to select the data type of the definition. Currently 4 data types are selectable:
    i.	String – these values must be entered in double quotes (“Example String”)  
    ii.	Boolean – this can either be true or false  
    iii.	Number – can be any decimal number  
    iv.	DateTime – this means that the def is of type date type. Data must be entered using this format – mm/dd/yyyy hh:mm:ss AM\PM  
    v.	Input – This is where you enter the value of your definition. The values entered here must conform to the chosen data type. User can either enter a single value, a set of values separated by commas, or a range of values using keyword to. For eg., user can enter unique value 1; a set 1, 2, 3; or a range 1 to 5. Note that range is only supported for number.

![Alt text][5]
##XML Definition
If Vocabulary Type is chosen as XML, the following inputs needs to be specified  
  a.	Schema – Clicking on this will open a new blade allowing user to either choose from a list of already uploaded schemas or allowing to upload a new one.   
  b.	XPATH – this input gets unlocked only after choosing a schema in the previous step. Clicking on this will display the schema that was selected and allows the user to select the node for which a vocabulary definition needs to be created.  
  c.	FACT – This input identifies which data object would be fed to the rules engine for processing. This is an advanced property and by default is set to the parent of the selected XPATH. FACT becomes particularly important for chaining and collection scenarios.

![Alt text][6]

### Add Bulk
The above steps have captured the experience for creating Vocabulary definitions. Once created, the created vocabulary definitions will appear in list form. There are requirements to be able to generate multiple definitions from the same schema instead of repeating the above steps every single time. This is where Add Bulk capability becomes very useful. 
Clicking on “Add Bulk” will take you to a new blade. The first step is to select the schema for which multiple definitions are to be created. Clicking on this will open a new blade allowing user to either choose from a list of already uploaded schemas or allowing to upload a new one.
Now the XPATHS property gets unlocked. Clicking on this will open the Schema Viewer where multiple nodes can be selected.
The names for the multiple definitions created will default to the name of the node selected. These can always be modified after creation.

![Alt text][7]

##Policy Creation
Once the developer has created required vocabularies, the expectation is that the Business Analyst would be the one creating Business Policies via the Azure Portal.  
	1.	On the Rules App created, there is a Policy lens clicking which the user will go into the Policy creation page.  
	2.	This page will show the list of policies, this particular Rules App has. User can add a new Policy by simply typing a policy name and hitting tab. Multiple policies can reside in a single Rules API App.  
	3.	Clicking on the created Policy will take the user to the Policy details page where one can see the rules that are in the policy.  
	![Alt text][8]
	4.	Click on “Add New” to add a new rule. This will take you to a new blade.

##Rule Creation
A rule is collection of condition and action statements. The actions get executed if the condition evaluates to true. In the Create Rule blade, give a unique rule name (for that policy) and description (optional).
The Condition box can be used to create complex conditional statements. Following are the keywords supported:  
1. 	And – conditional operator  
2. 	Or – conditional operator  
3. 	does\_not\_exist  
4. 	exists  
5. 	false  
6. 	is\_equal\_to  
7. 	is\_greater\_than  
8. 	is\_greater\_than\_equal\_to  
9. 	is\_in  
10. is\_less\_than  
11. is\_less\_than\_equal\_to  
12. is\_not\_in  
13. is\_not\_equal\_to  
14. mod  
15. true  

The Action(Then) box can contain multiple statements, one per line, to create actions that are to be executed. Following are the keywords supported:  
1.	equals  
2.	false  
3.	true  
4.	halt  
5.	mod  
6.	null  
7.	update  

Condition and action boxes provide Intellisense to help user author a rule quickly. This can be triggered by hitting ctrl+space or by just starting to type. Keywords matching typed characters will automatically be filtered down and shown. The intellisense window will show all keywords and vocabulary definitions.
![Alt text][9]

##Explicit Forward Chaining
BizTalk Rules supports explicit forward chaining. What this means is that if users would like to re-evaluate rules in response to certain actions, they can trigger this by using certain keywords. The following are the keywords supported:  
   1.	update <vocabulary definition> – this keyword re-evaluates all rules that use the specified vocabulary definition in its condition.  
   2.	Halt – this keyword stops all rule executions

##Enable\Disable Rules
Each rule in the policy can be enabled or disabled. By default all rules are enabled. Disabled rules wont be executed during policy execution. Enable\Disable rules can be done either from the rule blade directly – the commands are available in the command bar at the top of the blade, or from the policy, the context menu (right-click on a rule) has the option to enable\disable.

##Rule Priority
All the rules of a policy are executed in order. The priority of execution is determined by the order in which they occur in the policy. This priority can be changed by simply dragging and dropping the rule. 

##Test Policy
After authoring your policy, before using it in production, there is provision for testing the policy. By using the “Test Policy” command, users can get into the Test Policy blade. In this blade you can see a list of vocabulary definitions that are used in the policy that require a user input. Users can manually add values for these inputs for their test scenario. Alternately, users can also choose to import test XMLs for inputs. Once all the inputs are in, the test can be run and the outputs for each vocabulary definition will be displayed in the output column for easy comparison. To view Business Analyst friendly logs, click on “View Logs” to view the execution logs. To save the logs, the “Save Output” option is available to store all test related data for independent analysis.

## Using Rules in Logic Apps
Once the policy has been authored and tested, it is now ready for consumption. Users can create a new Logic App by doing New->Logic App. In the designer, BizTalk Rules is  available in the gallery to the right. This can now be dragged and dropped onto the designer surface. Once this is done, there will be an option to choose which Rules API App(Action) to target. Actions include the list of policies that are to be executed. Choose a specific policy after which the inputs required for the policy needs to be input. Users can use the output from the Rules API App downstream for further decision making.

## Using Rules via APIs
The Rules API App can also be invoked using a rich set of APIs available. This way users aren’t restricted to just using flows and can use Rules in any application by making REST calls. The exact REST APIs available can be viewed by clicking on the "API Definiton" lens in the Rules dashboard.

![Alt text][10]

Following is an example of how one might use this API in C#

   			// Constructing the JSON message to use in API call to Rules API App

			// xmlInstance is the XML message instance to be passed as input to our Policy
            string xmlInstance = "<ns0:Patient xmlns:ns0=\"http://tempuri.org/XMLSchema.xsd\">  <ns0:Name>Name_0</ns0:Name>  <ns0:Email>Email_0</ns0:Email>  <ns0:PatientID>PatientID_0</ns0:PatientID>  <ns0:Age>10.4</ns0:Age>  <ns0:Claim>    <ns0:ClaimDate>2012-05-31T13:20:00.000-05:00</ns0:ClaimDate>    <ns0:ClaimID>10</ns0:ClaimID>    <ns0:TreatmentID>12</ns0:TreatmentID>    <ns0:ClaimAmount>10000.0</ns0:ClaimAmount>    <ns0:ClaimStatus>ClaimStatus_0</ns0:ClaimStatus>    <ns0:ClaimStatusReason>ClaimStatusReason_0</ns0:ClaimStatusReason>  </ns0:Claim></ns0:Patient>";

            JObject input = new JObject();

			// The JSON object is to be of form {"<XMLSchemName>_<RootNodeName>":"<XML Instance String>". 
			// In the below case, we are using XML Schema - "insruanceclaimsschema" and the root node is "Patient". 
			// This is CASE SENSITIVE. 
            input.Add("insuranceclaimschema_Patient", xmlInstance);
            string stringContent = JsonConvert.SerializeObject(input);


            // Making REST call to Rules API App
            HttpClient httpClient = new HttpClient();
	
			// The url is the Host URL of the Rules API App
            httpClient.BaseAddress = new Uri("https://rulesservice77492755b7b54c3f9e1df8ba0b065dc6.azurewebsites.net/");            
            HttpContent httpContent = new StringContent(stringContent);
            httpContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");            

            // Invoking API "Execute" on policy "InsruranceClaimPolicy" and getting response JSON object. The url can be gotten from the API Definition Lens
            var postReponse = httpClient.PostAsync("api/Policies/InsuranceClaimPolicy?comp=Execute", httpContent).Result;

Note that the above Rules API App has its security settings set to "Public Anon". This can be set  from within the API App using - All settings->Application Settings -> Access Level

![Alt text][11]

## Editing Vocabulary and Policy
One of the main advantages of using Business Rules is that changes to business logic can be pushed out to production a lot faster. Any change made to vocabulary and policies is immediately applied in production. User simply needs to browse to the respective vocabulary definition or policy and make the change to have it come into effect.

<!--Image references-->
[1]: ./media/app-service-logic-use-biztalk-rules/InsuranceScenario.PNG	
[2]: ./media/app-service-logic-use-biztalk-rules/InsuranceBusinessLogic.png
[3]: ./media/app-service-logic-use-biztalk-rules/CreateRuleApiApp.png
[4]: ./media/app-service-logic-use-biztalk-rules/RulesDashboard.png
[5]: ./media/app-service-logic-use-biztalk-rules/LiteralVocab.PNG
[6]: ./media/app-service-logic-use-biztalk-rules/XMLVocab.PNG
[7]: ./media/app-service-logic-use-biztalk-rules/BulkAdd.PNG
[8]: ./media/app-service-logic-use-biztalk-rules/PolicyList.PNG
[9]: ./media/app-service-logic-use-biztalk-rules/RuleCreate.PNG
[10]: ./media/app-service-logic-use-biztalk-rules/APIDef.PNG
[11]: ./media/app-service-logic-use-biztalk-rules/PublicAnon.PNG


