Supervised machine learning algorithms need labels, i.e., the ground truth against the raw data. In some scenarios, such as consumer behavior or weather-related measurements, recorded observations can act as labels. However, in many other scenarios, human expertise is needed to specify the labels. 

Most ML datasets are so large you need not only UI tools to perform the labeling tasks, but tools to manage the resulting data and labels. They may also need to specify what kind of quality issues these are.  Depending on your data volume, not only you need UI tools to perform the labeling tasks, but also a way to manage the data and labels that are produced. Since data labeling involves human intelligence, data labeling can be bias and error prone, expensive, and time consuming. Data Scientist teams need to wait for weeks and often months for the labeled data before they can produce even the first model.   

With the launch of data labeling capability in preview at Ignite as part of Azure Machine Learning services, we have started the journey to help the pain points of data labeling in the data science workflow. Our mission is to keep optimizing on the cost, time, and quality of data labeling. At a high level, our approach is to appropriately use machine learning, smart labeling workflows, and intelligent tooling in the process. 

 

In our first release, we are providing a well-integrated experience within the Azure Machine learning workspace to enable end-to-end execution of labeling projects. We provide out- of- the- box labeling tools for multi-label image classification, multi-class image classification, and object detection in images. You can create a team of domain experts who work in parallel and use an independent browser- based labeling portal to create labels against your data. 

 

As experts create the labels, we use those labels to train a machine learning model in the background. We use this model to pre-label the data points for experts to review and fix rather than creating the  labels from scratch. Our study shows that pre-labeling reduces the effort required by up to 60% without compromising on quality. In addition to pre-labeling the data points, we also use the model for active learning, i.e. to prioritize the data points that should be labeled next in order to mature the model faster. ML assisted labeling is an optional feature and is currently available to a select group of customers. Contact your Microsoft account representative if you want to try out ML assisted labeling. 

 

Get started with Azure ML Data Labeling 

To start using the data labeling capability, go to Azure Machine Learning workspace where you will find Data Labeling under the Manage section.  

 

 

Create a new project by clicking on ‘Add Project’ and following the project creation wizard. Azure ML data labeling accepts Azure ML datasets as inputs. These datasets are an easy way to manage your data within Azure ML workspace. You can create and run multiple data labeling projects in parallel.  

 

 

 

After creating the project, you can label the data yourself, and optionally add domain experts to the project using their email addresses. These experts will need to authenticate to the labeler portal using their AAD (Azure Active Directory) account or MSA account (Live Id) before they can start creating labels.  

 

 

You can monitor the progress of the labeling project as well as review the labels created by experts in the Azure ML workspace. You can reject poor-quality labels if needed. Rejected labels are sent back to the pool of unlabeled data and Azure chooses another labeler to complete the labeling task. 

It is quite common to discover new label classes in your data after you have labeled a few data points. Azure ML Data Labeling allows you to add new classes to an existing project. At that time, we give you the option to either reset the project, revise the existing labels, or continue with labeling without revisiting already labeled data points.  

At any point in time during the execution of the project, you can export the image labels in either COCO format or as an Azure ML dataset. Azure ML dataset format makes it easy to consume the labels with other Azure ML components. 