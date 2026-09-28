import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

let isConnected = false;

const connect = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return "db already connected";
  }

  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "db-event",
    });

    isConnected = true;

    return "db connected successfully";
  } catch (error) {
    isConnected = false;
    throw error;
  }
};

export default connect;

// import mongoose from "mongoose";
// import { DATABASE_URL } from "./env";

// const connect = async () => {
//   try {
//     await mongoose.connect(DATABASE_URL, {
//       dbName: "db-event",
//     });

//     return Promise.resolve("db connected succesfully");
//   } catch (error) {
//     return Promise.reject(error)
//   }
// };

// export default connect;
