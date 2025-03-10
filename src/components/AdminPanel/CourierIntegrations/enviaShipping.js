import { React, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "../../../axios";

//
import { Radio, RadioGroup, FormControlLabel, Divider } from "@mui/material";
import { TextField, Button, Alert, Stack } from "@mui/material";
import { Typography, Tooltip, FormLabel, FormControl } from "@mui/material";
import { Grid, Chip, CircularProgress } from "@mui/material";

// MUi Icons
import RupeeIcon from "@mui/icons-material/CurrencyRupee";

const enviaTestURL = {
  rate: "/proxy/https://api.envia.com/ship/rate/",
  courierList: "/proxy/https://queries.envia.com/available-carrier/IN/0",
  createShipment: "/proxy/https://api.envia.com/ship/generate/",
};

const EnviaShipping = () => {
  const history = useHistory();
  const params = useParams();

  // Loading States
  const [servicesLoad, setServicesLoad] = useState(false);
  const [shipmentLoad, setShipmentLoad] = useState(false);
  const [orderUpdate, setOrderUpdate] = useState(false);
  const [shipment, setShipment] = useState(false);
  const [update, setUpdate] = useState(false);

  // States
  const [order, setOrder] = useState({});
  const [token, setToken] = useState(process.env.REACT_APP_ENVIA_TOKEN);
  const [weight, setWeight] = useState(0);
  const [length, setLength] = useState(30);
  const [breadth, setBreadth] = useState(20);
  const [height, setHeight] = useState(2);
  const [courierList, setCourierList] = useState([]);
  const [carrier, setCarrier] = useState({});
  const [pdf, setPdf] = useState("");

  // Header Auth
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get("/admin-getOrderDetails", {
        params: { orderId: params.orderId },
      })
      .then((res) => {
        // console.log(res.data);
        setOrder(res.data);
        setWeight(res.data.weightInGrams);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [params.orderId]);

  const getStateCode = (stateName) => {
    const stateIds = [
      { zoneId: 1475, state: "Andaman and Nicobar Islands", stateCode: "AN" },
      { zoneId: 1476, state: "Andhra Pradesh", stateCode: "AP" },
      { zoneId: 1477, state: "Arunachal Pradesh", stateCode: "AR" },
      { zoneId: 1478, state: "Assam", stateCode: "AS" },
      { zoneId: 1479, state: "Bihar", stateCode: "BI" },
      { zoneId: 1480, state: "Chandigarh", stateCode: "CH" },
      { zoneId: 1481, state: "Dadra and Nagar Haveli", stateCode: "DA" },
      { zoneId: 1482, state: "Daman and Diu", stateCode: "DM" },
      { zoneId: 1483, state: "Delhi", stateCode: "DE" },
      { zoneId: 1484, state: "Goa", stateCode: "GO" },
      { zoneId: 1485, state: "Gujarat", stateCode: "GU" },
      { zoneId: 1486, state: "Haryana", stateCode: "HA" },
      { zoneId: 1487, state: "Himachal Pradesh", stateCode: "HP" },
      { zoneId: 1488, state: "Jammu and Kashmir", stateCode: "JA" },
      { zoneId: 1489, state: "Karnataka", stateCode: "KA" },
      { zoneId: 1490, state: "Kerala", stateCode: "KE" },
      { zoneId: 1491, state: "Lakshadweep Islands", stateCode: "LI" },
      { zoneId: 1492, state: "Madhya Pradesh", stateCode: "MP" },
      { zoneId: 1493, state: "Maharashtra", stateCode: "MA" },
      { zoneId: 1494, state: "Manipur", stateCode: "MN" },
      { zoneId: 1495, state: "Meghalaya", stateCode: "ME" },
      { zoneId: 1496, state: "Mizoram", stateCode: "MI" },
      { zoneId: 1497, state: "Nagaland", stateCode: "NA" },
      { zoneId: 1498, state: "Odisha", stateCode: "OD" },
      { zoneId: 1499, state: "Puducherry", stateCode: "PO" },
      { zoneId: 1500, state: "Punjab", stateCode: "PU" },
      { zoneId: 1501, state: "Rajasthan", stateCode: "RA" },
      { zoneId: 1502, state: "Sikkim", stateCode: "SI" },
      { zoneId: 1503, state: "Tamil Nadu", stateCode: "TN" },
      { zoneId: 1504, state: "Tripura", stateCode: "TR" },
      { zoneId: 1505, state: "Uttar Pradesh", stateCode: "UP" },
      { zoneId: 1506, state: "West Bengal", stateCode: "WB" },
      { zoneId: 4231, state: "Telangana", stateCode: "TS" },
      { zoneId: 4239, state: "Jharkhand", stateCode: "JH" },
      { zoneId: 4240, state: "Uttarakhand", stateCode: "UK" },
      { zoneId: 4241, state: "Chattisgarh", stateCode: "CG" },
      { zoneId: 4242, state: "Ladakh", stateCode: "LA" },
    ];

    return stateIds.find((s) => s.state === stateName).stateCode;
  };

  const getOneCarrierRate = async (carrier) => {
    const params = {
      origin: {
        name: order.sellerName,
        company: "bookshlf",
        email: "bookshlf.in@gmail.com",
        phone: order.sellerAddress.phoneNo,
        street: order.sellerAddress.address,
        number: "0",
        district: order.sellerAddress.city,
        city: order.sellerAddress.city,
        state: getStateCode(order.sellerAddress.state),
        country: "IN",
        postalCode: order.sellerAddress.zipCode.toString(),
        reference: "",
      },
      destination: {
        name: order.customerName,
        company: "bookshlf",
        email: "bookshlf.in@gmail.com",
        phone: order.customerAddress.phoneNo,
        street: order.customerAddress.address,
        number: "0",
        district: order.customerAddress.city,
        city: order.customerAddress.city,
        state: getStateCode(order.sellerAddress.state),
        country: "IN",
        postalCode: order.customerAddress.zipCode.toString(),
        reference: "",
      },
      packages: [
        {
          content: "Books",
          amount: 1,
          type: "box",
          weight: Math.round(order.weightInGrams / 1000, 2),
          insurance: order.orderTotal > 2000 ? 1 : 0,
          declaredValue: order.orderTotal,
          weightUnit: "KG",
          lengthUnit: "CM",
          dimensions: {
            length: length,
            width: breadth,
            height: height,
          },
        },
      ],
      shipment: {
        carrier: carrier.name,
        type: 0,
      },
      settings: {
        currency: "INR",
      },
    };

    // console.log(params);
    const result = axios
      .post(enviaTestURL.rate, params, Auth)
      .then((res) => {
        // console.log(res.data);
        if (res.data.meta === "rate") return res.data.data;
        return;
      })
      .catch((err) => {
        // console.log(err.response.data);
        return;
      });
    return result;
  };

  const getAllCarriersRate = async (carriers) => {
    const allCarriers = await Promise.all(
      carriers.map(async (carrier) => {
        const data = await getOneCarrierRate(carrier);
        return data;
      })
    );
    // console.log(allCarriers.flat(1).filter((carrier) => carrier !== undefined));
    return allCarriers
      .flat(1)
      .filter((carrier) => carrier !== undefined)
      .sort((a, b) => {
        return a.totalPrice - b.totalPrice;
      });
  };

  const fetchServices = async () => {
    setServicesLoad(true);
    axios
      .get(enviaTestURL.courierList, Auth)
      .then(async (res) => {
        // console.log(res.data.data);
        const carriers = await getAllCarriersRate(res.data.data);
        setCourierList(carriers);
        setServicesLoad(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        setServicesLoad(false);
      });
  };

  const handleRadioChange = (e) => {
    setCarrier({
      carrier: courierList[e.target.value].carrier,
      service: courierList[e.target.value].service,
      type: 0,
    });
  };

  const updateOrder = async (shipmentData) => {
    const externalTrackingLink = shipmentData.trackUrl;
    const externalTrackingDetails = `${shipmentData.carrier}, Service: ${shipmentData.service}, Tracking Number : ${shipmentData.trackingNumber}`;
    const adminDeliveryExpense = shipmentData.totalPrice;

    axios
      .post("/admin-updateOrder", {
        orderId: order._id,
        externalTrackingLink,
        externalTrackingDetails,
        adminDeliveryExpense,
      })
      .then((response) => {
        axios
          .post("/admin-markOrderAsPacked", { orderId: order._id })
          .then(() => {
            setUpdate(true);
            setTimeout(() => {
              history.push(`/AdminTrack/${order._id}`);
            }, 2000);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createShipment = async () => {
    setShipmentLoad(true);
    const params = {
      origin: {
        name: order.sellerName,
        company: "bookshlf",
        email: "bookshlf.in@gmail.com",
        phone: order.sellerAddress.phoneNo,
        street: order.sellerAddress.address,
        number: "0",
        district: order.sellerAddress.city,
        city: order.sellerAddress.city,
        state: getStateCode(order.sellerAddress.state),
        country: "IN",
        postalCode: order.sellerAddress.zipCode.toString(),
        reference: "",
      },
      destination: {
        name: order.customerName,
        company: "bookshlf",
        email: "bookshlf.in@gmail.com",
        phone: order.customerAddress.phoneNo,
        street: order.customerAddress.address,
        number: "0",
        district: order.customerAddress.city,
        city: order.customerAddress.city,
        state: getStateCode(order.sellerAddress.state),
        country: "IN",
        postalCode: order.customerAddress.zipCode.toString(),
        reference: "",
      },
      packages: [
        {
          content: "Books",
          amount: 1,
          type: "box",
          weight: Math.round(order.weightInGrams / 1000, 2),
          insurance: order.orderTotal > 2000 ? 1 : 0,
          declaredValue: order.orderTotal,
          weightUnit: "KG",
          lengthUnit: "CM",
          dimensions: {
            length: length,
            width: breadth,
            height: height,
          },
        },
      ],
      shipment: carrier,
      settings: {
        printFormat: "PDF",
        printSize: "STOCK_4X6",
        currency: "INR",
      },
    };
    axios
      .post(enviaTestURL.createShipment, params, Auth)
      .then(async (res) => {
        // console.log(res.data);
        setPdf(res.data.data[0].label);
        setOrderUpdate(true);
        await updateOrder(res.data.data[0]);
        setOrderUpdate(false);
        setShipmentLoad(false);
        setShipment(true);
      })
      .catch((err) => {
        console.log(err.response);
        setShipmentLoad(false);
      });
  };

  return (
    <Stack
      spacing={2}
      justifyContent="center"
      alignItems="center"
      sx={{
        border: "1px solid rgba(0,0,0,0.2)",
        padding: "20px",
        borderRadius: "5px",
        margin: "10px 24px",
      }}
      divider={<Divider orientation="horizontal" flexItem />}
    >
      <Stack
        direction="row"
        spacing={2}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <img src="/images/smallLogo.png" height="43px" alt="Bookshlf" />
        <img src="/images/enviaLogo.svg" height="43px" alt="Envia Shipping" />
      </Stack>
      <Stack direction="row" spacing={2}>
        <Typography>{order.title}</Typography>
        <img src={order.photo} alt={order.title} height="200px" width="auto" />
        <Stack
          spacing={2}
          sx={{
            padding: "10px",
            border: "1px solid rgba(0,0,0,0.2)",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" sx={{ fontFamily: "Staatliches" }}>
            Courier Dimensions
          </Typography>
          <TextField
            label="Weight in grams"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ maxWidth: 150 }}
            onChange={(e) => setWeight(e.target.value)}
            value={weight}
          />
          <TextField
            label="Length in cm"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ maxWidth: 150 }}
            onChange={(e) => setLength(e.target.value)}
            value={length}
          />
          <TextField
            label="Breadth in cm"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ maxWidth: 150 }}
            onChange={(e) => setBreadth(e.target.value)}
            value={breadth}
          />
          <TextField
            label="Height in cm"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ maxWidth: 150 }}
            onChange={(e) => setHeight(e.target.value)}
            value={height}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={fetchServices}
            disabled={servicesLoad}
            endIcon={
              servicesLoad ? (
                <CircularProgress color="inherit" size={12} />
              ) : null
            }
          >
            Fetch Services
          </Button>
        </Stack>
      </Stack>

      {courierList.length > 0 && (
        <FormControl>
          <FormLabel id="shipment-services" sx={{ marginBottom: "10px" }}>
            <Typography
              variant="h6"
              sx={{ fontFamily: "staatliches" }}
              textAlign="center"
            >
              Available services
            </Typography>
          </FormLabel>
          <RadioGroup
            aria-labelledby="shipment-services"
            name="radio-buttons-group"
            default={0}
          >
            <Grid container spacing={2}>
              {courierList.map((carrier, idx) => (
                <Grid item xs={6} sm={4} md={4} lg={3} key={idx}>
                  <Tooltip
                    key={idx}
                    title={
                      "Service : " +
                      carrier.service +
                      " --- Service Description : " +
                      carrier.serviceDescription
                    }
                    sx={{
                      padding: "10px",
                      border: "1px solid rgba(0,0,0,0.2)",
                      borderRadius: "10px",
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <FormControlLabel
                      value={idx}
                      control={<Radio size="small" />}
                      onClick={handleRadioChange}
                      label={
                        <Stack
                          direction="row"
                          spacing={1}
                          divider={<Divider orientation="vertical" flexItem />}
                          alignItems="center"
                        >
                          <Chip
                            size="small"
                            variant="outlined"
                            color="success"
                            icon={<RupeeIcon sx={{ height: 12 }} />}
                            label={carrier.totalPrice}
                            sx={{ minWidth: 100 }}
                          />
                          <Stack spacing={1}>
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "11px" }}
                            >
                              {carrier.carrier}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "11px" }}
                            >
                              Delivery Time :{" "}
                              {carrier.deliveryDate.dateDifference}
                            </Typography>
                          </Stack>
                        </Stack>
                      }
                    />
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>
      )}
      {update ? <Alert severity="info">Redirecting to Order Page</Alert> : null}
      {update ? (
        <Alert severity="success">Order Updated Successfully</Alert>
      ) : null}
      {orderUpdate ? (
        <Alert severity="warning">Updating Order Please Wait...</Alert>
      ) : null}
      {shipment ? (
        <Alert severity="success">Shipment Created Successfully!</Alert>
      ) : null}
      {pdf ? (
        <Button href={pdf} target="_blank" size="small" variant="outlined">
          View Reciept
        </Button>
      ) : null}
      {carrier.carrier ? (
        <Button
          onClick={createShipment}
          endIcon={
            shipmentLoad ? <CircularProgress size={12} color="inherit" /> : null
          }
          disabled={shipmentLoad}
          size="small"
          color="success"
          variant="contained"
        >
          Create Shipment
        </Button>
      ) : null}
    </Stack>
  );
};

export default EnviaShipping;
