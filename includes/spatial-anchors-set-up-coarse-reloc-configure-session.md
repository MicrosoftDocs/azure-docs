## Configure the cloud anchor session

We'll take care of configuring the cloud anchor session next. On the first line we set the sensor provider on the session. This will ensure that any anchor we create during the session will be associated with a set of sensor readings. Once that is done, we 
instantiate a near-device locate criteria and initialize it to match the application requirements. Finally, we instruct the session to use sensor data when locating anchors by creating a watcher from our near-device criteria.