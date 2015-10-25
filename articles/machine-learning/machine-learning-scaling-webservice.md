# Scaling Web Service #
## Increase Concurrency ##
By default, each published web service is configured to support 20 concurrent request. The user can increase this concurrency to 200 concurrent request through [Azure Management Portal](https://manage.windowsazure.com/) as shown in the figure below:



Go to [Azure Management Portal](https://manage.windowsazure.com/), click Machine Learning icon on the left, select the work space used for publishing web service, click desired web service, select the endpoint that needs increase in concurrency,  click configure. Use slider to increase the concurrency and then click save on the bottom panel.


![](http://neerajkh.blob.core.windows.net/images/ConfigureEndpointCapture.png)

## Add new endpoints for same web service ##
The scaling of web service is a common task either to support more than 200 concurrent request, increase availability through multiple endpoints or to provide separate endpoint for different consumer of web service. The user can increase the scale by adding additional endpoints for the same web service. The user can add additional endpoints through [Azure Management Portal](https://manage.windowsazure.com/) as shown in the figure below:


Go to [Azure Management Portal](https://manage.windowsazure.com/), click Machine Learning icon on the left, select the work space used for publishing web service, click desired web service, click "Add Endpoint" on the bottom panel, and finally, provide a name, description and desired concurrency for the new endpoint.


![](http://neerajkh.blob.core.windows.net/images/AddEndpoint.png)
