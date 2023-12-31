import {Container,VStack,FormLabel,Input,Heading, Box,Button,Avatar} from "@chakra-ui/react"
import React,{useState} from 'react'
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux";
import { register } from "../../redux/actions/user";

export const fileUploadCss = {
    cursor:'pointer',
    marginLeft:'-5%',
    width:'110%',
    border:'none',
    height:'100%',
    color:'black',
    backgroundColor:'white',
    fontWeight:"600"
}


const fileUploadStyle = {
    "&::file-selector-button":fileUploadCss,
}

 
const Register = () => {

    const [email , setEmail] = useState("")
    const [password,setPassword]=useState("")
    const [name,setName] = useState("")
    const [imagePrev,setimagePrev] = useState("")
    const [image,setImage] = useState('');

    const dispatch= useDispatch();

    const changeImageHandler = (e) =>{
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              setimagePrev(reader.result);
              setImage(file);
            };
          }
    }

    const submitHandler=(e)=>{
        e.preventDefault();
        const myForm = new FormData();

        myForm.append('name',name);
        myForm.append('email',email);
        myForm.append('password',password);
        myForm.append('file',image);

        dispatch(register(myForm));

    }

  return (
   <Container h={'105vh'} mt={"100px"}>
        <VStack h={'full'} justifyContent="center" spacing={'16'}>
            <Heading textTransform = {"uppercase"} children ={'Registration '} />
           
            <form  onSubmit={submitHandler} style={{width:'100%'}}>
            <Box my="4" display={'flex'} justifyContent="center">
                {imagePrev && <Avatar size={'2xl'} src={imagePrev} />}
            </Box>

            <Box my={'4'}>
                <FormLabel htmlFor="name" children="Name" />
                <Input 
                required 
                id="name" 
                value={name}
                onChange={e=>setName(e.target.value)}
                placeholder="abc"
                type={"text"}
                focusBorderColor="yellow.500"
                />
                </Box>

                <Box my={'4'}>
                <FormLabel htmlFor="email" children="Email Address" />
                <Input 
                required 
                id="email" 
                value={email}
                onChange={e=>setEmail(e.target.value)}
                placeholder="abc@gmail.com"
                type={"email"}
                focusBorderColor="yellow.500"
                />
                </Box>

                <Box my={'4'}>
                <FormLabel htmlFor="password" children="Password" />
                <Input 
                required 
                id="password" 
                value={password}
                onChange={e=>setPassword(e.target.value)}
                placeholder="Enter your password"
                type={"password"}
                focusBorderColor="yellow.500"
                />
                </Box>

                <Box my={'4'}>
                <FormLabel htmlFor="chooseAvatar" children="Chooose Avatar" />
                <Input 
                accept="image/*" 
                required
                id="chooseAvatar" 
                type={'file'}
                focusBorderColor="yellow.500"
                css={fileUploadStyle}
                onChange={changeImageHandler}
                />
                </Box>

                <Button my="4" colorScheme = {"yellow"} type="submit">
                 Sign Up
                </Button>
                
                <Box my="4">
                    Already Signed Up ?{' '} 
                    {/* upar wala line samajh me nhi aata */}
                    <Link to = "/login">
                        <Button colorScheme={'yellow'} variant="link">
                            Login Here
                        </Button> {" "}
                        here
                    </Link>
                </Box>

            </form>
        </VStack>
   </Container>
  )
}
export default Register