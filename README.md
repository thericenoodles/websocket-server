# websocket-server
websocket server using serverless nodejs

## How to send message
Current development endpoint:  `wss://jtk31hqq0d.execute-api.ap-southeast-1.amazonaws.com/dev`

Message format
```JSON
{"action": "sendMessage", "message": "Hello"}
```

## Testing on console
1. Install `wscat`:
`npm install -g wscat`

2. Then run:
`wscat -c wss://jtk31hqq0d.execute-api.ap-southeast-1.amazonaws.com/dev`

3. Once connected, send:
`{"action": "sendMessage", "message": "Hello"}`

4. Open multiple instances of wscat to test if message is broadcasted on other instances. :smile:
