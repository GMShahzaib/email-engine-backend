import { Client } from "@elastic/elasticsearch"
import Env from  "../env/Env.js"

//elastic-client
const elasticClient = new Client({
  cloud: {
    id: Env.ELASTIC.CLOUD_ID,
  },
  auth: {
    username: Env.ELASTIC.USERNAME,
    password: Env.ELASTIC.PASSWORD,
  },
});

export default elasticClient;