---
title: Java samples to illustrate connection pooling
description: This article lists Java samples to illustrate connection pooling.
author: SudheeshGH
ms.author: sunaray
ms.custom: devx-track-java, devx-track-extended-java
ms.service: mysql
ms.subservice: single-server
ms.topic: sample
ms.date: 06/20/2022
---

# Java sample to illustrate connection pooling

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

The below sample code illustrates connection pooling in Java.

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashSet;
import java.util.Set;
import java.util.Stack;

public class MySQLConnectionPool {
	private String databaseUrl;
	private String userName;
	private String password;
	private int maxPoolSize = 10;
	private int connNum = 0;

	private static final String SQL_VERIFYCONN = "select 1";

	Stack<Connection> freePool = new Stack<>();
	Set<Connection> occupiedPool = new HashSet<>();

	/**
	 * Constructor
	 * 
	 * @param databaseUrl
	 *            The connection url
	 * @param userName
	 *            user name
	 * @param password
	 *            password
	 * @param maxSize
	 *            max size of the connection pool
	 */
	public MySQLConnectionPool(String databaseUrl, String userName,
			String password, int maxSize) {
		this.databaseUrl = databaseUrl;
		this.userName = userName;
		this.password = password;
		this.maxPoolSize = maxSize;
	}

	/**
	 * Get an available connection
	 * 
	 * @return An available connection
	 * @throws SQLException
	 *             Fail to get an available connection
	 */
	public synchronized Connection getConnection() throws SQLException {
		Connection conn = null;

		if (isFull()) {
			throw new SQLException("The connection pool is full.");
		}

		conn = getConnectionFromPool();

		// If there is no free connection, create a new one.
		if (conn == null) {
			conn = createNewConnectionForPool();
		}

		// For Azure Database for MySQL, if there is no action on one connection for some
		// time, the connection is lost. By this, make sure the connection is
		// active. Otherwise reconnect it.
		conn = makeAvailable(conn);
		return conn;
	}

	/**
	 * Return a connection to the pool
	 * 
	 * @param conn
	 *            The connection
	 * @throws SQLException
	 *             When the connection is returned already or it isn't gotten
	 *             from the pool.
	 */
	public synchronized void returnConnection(Connection conn)
			throws SQLException {
		if (conn == null) {
			throw new NullPointerException();
		}
		if (!occupiedPool.remove(conn)) {
			throw new SQLException(
					"The connection is returned already or it isn't for this pool");
		}
		freePool.push(conn);
	}

	/**
	 * Verify if the connection is full.
	 * 
	 * @return if the connection is full
	 */
	private synchronized boolean isFull() {
		return ((freePool.size() == 0) && (connNum >= maxPoolSize));
	}

	/**
	 * Create a connection for the pool
	 * 
	 * @return the new created connection
	 * @throws SQLException
	 *             When fail to create a new connection.
	 */
	private Connection createNewConnectionForPool() throws SQLException {
		Connection conn = createNewConnection();
		connNum++;
		occupiedPool.add(conn);
		return conn;
	}

	/**
	 * Crate a new connection
	 * 
	 * @return the new created connection
	 * @throws SQLException
	 *             When fail to create a new connection.
	 */
	private Connection createNewConnection() throws SQLException {
		Connection conn = null;
		conn = DriverManager.getConnection(databaseUrl, userName, password);
		return conn;
	}

	/**
	 * Get a connection from the pool. If there is no free connection, return
	 * null
	 * 
	 * @return the connection.
	 */
	private Connection getConnectionFromPool() {
		Connection conn = null;
		if (freePool.size() > 0) {
			conn = freePool.pop();
			occupiedPool.add(conn);
		}
		return conn;
	}

	/**
	 * Make sure the connection is available now. Otherwise, reconnect it.
	 * 
	 * @param conn
	 *            The connection for verification.
	 * @return the available connection.
	 * @throws SQLException
	 *             Fail to get an available connection
	 */
	private Connection makeAvailable(Connection conn) throws SQLException {
		if (isConnectionAvailable(conn)) {
			return conn;
		}

		// If the connection is't available, reconnect it.
		occupiedPool.remove(conn);
		connNum--;
		conn.close();

		conn = createNewConnection();
		occupiedPool.add(conn);
		connNum++;
		return conn;
	}

	/**
	 * By running a sql to verify if the connection is available
	 * 
	 * @param conn
	 *            The connection for verification
	 * @return if the connection is available for now.
	 */
	private boolean isConnectionAvailable(Connection conn) {
		try (Statement st = conn.createStatement()) {
			st.executeQuery(SQL_VERIFYCONN);
			return true;
		} catch (SQLException e) {
			return false;
		}
	}
	
	// Just an Example
	public static void main(String[] args) throws SQLException {
		Connection conn = null;
		MySQLConnectionPool pool = new MySQLConnectionPool(
				"jdbc:mysql://mysqlaasdevintic-sha.cloudapp.net:3306/<Your DB name>",
				"<Your user>", "<Your Password>", 2);
		try {
			conn = pool.getConnection();
			try (Statement statement = conn.createStatement())
			{
				ResultSet res = statement.executeQuery("show tables");
				System.out.println("There are below tables:");
				while (res.next()) {
					String tblName = res.getString(1);
					System.out.println(tblName);
				}
			}
		}
		 finally {
			if (conn != null) {
				pool.returnConnection(conn);
			}
		}
	}

}

```
