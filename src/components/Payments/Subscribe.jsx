import { Box, Container,Heading, VStack,Text, Button } from '@chakra-ui/react'
import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { server } from '../../redux/store'
import axios from 'axios'
import { buySubscription } from '../../redux/actions/user'
import toast from "react-hot-toast"
import detective from "../../assets/images/detective.png"

const Subscribe = ({user}) => {

  const dispatch = useDispatch();
  const [key,setKey] = useState("");

  const {loading,error,subscriptionId} = useSelector(state=>state.subscription)
  const {error:courseError} = useSelector(
    state=>state.course
  )
  const subscribeHandler = async() =>{
    try{
      const response = await axios.get(`${server}/api/v1/razorpaykey`);
      const key = response.data.key;
      setKey(key);
      dispatch(buySubscription());
    }catch(error){
      toast.error("Failed to get Razorpay key.")
    }
  }

  

  useEffect(()=>{
    if(error){
      toast.error(error);
      dispatch({type:'clearError'});
    }
    if(courseError){
      toast.error(courseError);
      dispatch({type:'clearError'});
    }
    if(subscriptionId){
      const openPopUp = () =>{
        
        const options = {
          key,
          name:'CourseBundler',
          description:'Get access to all premium content',
          image:detective,
          subscription_id:subscriptionId,
          callback_url:`${server}/api/v1/paymentverification`,
          prefill:{
            name:user.name,
            email:user.email,
            contact:""
          },
          notes:{
            address:"Abhishek tutorials at youtube"
          },
          theme:{
            color:"#FFC800"
          }
        } 
        const razor = new window.Razorpay(options);
        razor.open();
      }
      openPopUp();
    }
  },[error,dispatch,user.email,key,subscriptionId,user.name,courseError])


  return (
    <Container h="90vh" p="16">
        <Heading children="Welcome" my="8" textAlign={'center'} />

        <VStack
          boxShadow={'lg'}
          alignItems="stretch"
          borderRadius={'lg'}
          spacing="0"
        >

        <Box bg="yellow.400" p={'4'} css={{borderRadius:"8px 8px 0 0"}}>
          <Text color = {"black"} children={'Pro Pack - ₹299.00'} />
        </Box>

        <Box p="4">
        <VStack textAlign={"center"} px="8" mt={"4"} spacing="8">
        <Text color={'black'} children={`Join Pro Pack and get Access to all content`}/>
        <Heading size="md" children={"₹299 Only"} />
        </VStack>

        <Button 
        my="8" 
        w="full"
        colorScheme={'yellow'}
        onClick={subscribeHandler}
        isLoading={loading}
        > 
        Buy Now 
        </Button>
        </Box>

        <Box 
        bg="blackAlpha.100"
        p="4"
        css={{borderRadius:'0 0 8px 8px'}}
        >
        <Heading
          color={'white'}
          textTransform="uppercase"
          size="sm"
          children={'100% refund at cancellation'}
         />
          <Text 
          fontSize={'xs'}
          color="white"
          children={'*Terms & Conditions Apply'}
          />
        </Box>  

        </VStack>
    </Container>
  )
}

export default Subscribe