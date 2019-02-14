<%@page import="java.io.FileWriter"%>
<%@page import="java.io.FileOutputStream"%>
<%@page import="java.io.FileInputStream"%>
<%@page import="java.io.InputStreamReader"%>
<%@page import="java.io.BufferedReader"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>json接口</title>
</head>
<body><%
String str="";
request.setCharacterEncoding("UTF-8");
if(request.getMethod().equals("GET")){
	try{
		BufferedReader reader=new BufferedReader(new InputStreamReader(
				new FileInputStream("F:\\JavaWeb\\thinks\\userdata\\json.json"),"UTF-8"));
		while(reader.ready()){
			str+=reader.readLine();
		}
		reader.close();
	}catch(Exception e){
		str="ERROR";
	}
}else{
	str=request.getParameter("tosave");
	try{
		FileOutputStream os=new FileOutputStream("F:\\JavaWeb\\thinks\\userdata\\json.json",false);
		os.write(str.getBytes("UTF-8"));
		os.flush();
		os.close();
		str="SUCCEED";
	}catch(Exception e){
		str="ERROR";
	}
}
%><%= str %></body>
</html>