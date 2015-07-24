
Next, you need to change when you register for notifications to make sure that the user is authenticated before registration is attempted.


1. In Project Explorer in Android Studio, open the ToDoActivity.java file and find the `onCreate` method. Move the following code from the `onCreate` method to the beginning of the `createTable` method.

        NotificationsManager.handleNotifications(this, SENDER_ID, MyHandler.class);

     The `createTable` method is called when `authenticate` method completes. Your entire `createTable` method should look similar to the following.

        private void createTable() {
        
            NotificationsManager.handleNotifications(this, SENDER_ID, MyHandler.class);
        
            // Get the Mobile Service Table instance to use
            mToDoTable = mClient.getTable(ToDoItem.class);
            
            mTextNewToDo = (EditText) findViewById(R.id.textNewToDo);
            
            // Create an adapter to bind the items with the view
            mAdapter = new ToDoItemAdapter(this, R.layout.row_list_to_do);
            ListView listViewToDo = (ListView) findViewById(R.id.listViewToDo);
            listViewToDo.setAdapter(mAdapter);
            
            // Load the items from the Mobile Service
            refreshItemsFromTable();
        }	

