import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InviteGuestsModal } from './invite-guests-modal'
import { ConfirmTripModal } from './confirm-trip-modal'
import { DestinationAndDateStep } from './steps/destination-and-date-step'
import { InviteGuestSteps } from './steps/invite-guests-step'
import { DateRange } from 'react-day-picker'
import { api } from '../../lib/axios'


export function CreateTripPage() {

    const navigate = useNavigate()

  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false)
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)

  const [destination,setDestination] = useState('')
  const [ownerName,setOwnerName] = useState('')
  const [ownerEmail,setOwnerEmail] = useState('')
  const [eventStartAndEndDate,setEventStartAndEndDate] = useState<DateRange | undefined>()
  
  
  const [emailsToInvite, setemailsToInvite] = useState([
    'alex.henrique@gmail.com',
    'bia.white@gmail.com',
  ])
  
  

  function openGuestsInput() {
    setIsGuestsInputOpen(true)
  }

  function closeGuestsInput(){
    setIsGuestsInputOpen(false)
  }

  function openGuestsModal(){
    setIsGuestsModalOpen(true)
  }

  function closeGuestsModal(){
    setIsGuestsModalOpen(false)
  }

  function openConfirmTripModal(){
    setIsConfirmTripModalOpen(true)
  }

  function closeConfirmTripModal(){
    setIsConfirmTripModalOpen(false)
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email =  data.get('email')?.toString()

    if(!email){
      return
    }

    if(emailsToInvite.includes(email)) {
      return
    }

    setemailsToInvite([
      ...emailsToInvite,
      email
    ])

    event.currentTarget.reset()
  }

  function removeEmailFronInvites(emailToRemove: string){
    const newEmailList = emailsToInvite.filter(email => email !==emailToRemove)

    setemailsToInvite(newEmailList)

  }

   async function createTrip(event: FormEvent<HTMLFormElement>){
    event.preventDefault()
    

    if (!destination){
      return
    }

    if (!eventStartAndEndDate?.from || !eventStartAndEndDate?.to){
      return
    }

    if (emailsToInvite.length === 0) {
      return
    }

    if (!ownerName || !ownerEmail) {
      return
    }


    const response = await api.post('/trips',{
      destination,
      starts_at: eventStartAndEndDate.from,
      ends_at: eventStartAndEndDate.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail
    })

    const {tripId} = response.data

    navigate(`/trips/${tripId}`)
    
  }


  return (
  <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
   <div className="max-w-3xl w-full px-6 text-center space-y-10">
    <div className='flex flex-col items-center gap-3'>
      <img src="/logo.svg" alt='Plann.er' />
     <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
     </div>

     <div className='space-y-4'>
      <DestinationAndDateStep
      closeGuestsInput = {closeGuestsInput}
      isGuestsInputOpen = {isGuestsInputOpen}
      openGuestsInput = {openGuestsInput}
      setDestination = {setDestination}
      eventStartAndEndDate = {eventStartAndEndDate}
      setEventStartAndEndDate = {setEventStartAndEndDate}
      />


     {isGuestsInputOpen && ( 
       <InviteGuestSteps
       emailsToInvite={emailsToInvite}
       openConfirmTripModal={openConfirmTripModal}
       openGuestsModal={openGuestsModal}
       />
    )}
     </div>




     <p className="text-sn text-zinc-500">
      Ao planejar sua viagem pela plann.er você automaticamente concorda<br/>
      com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.</p>
   </div>


   {isGuestsModalOpen && (
    <InviteGuestsModal
    emailsToInvite={emailsToInvite}
    closeGuestsModal={closeGuestsModal}
    addNewEmailToInvite={addNewEmailToInvite}
    removeEmailFronInvites={removeEmailFronInvites}
    />
   )}

    {isConfirmTripModalOpen &&(
    <ConfirmTripModal
    closeConfirmTripModal={closeConfirmTripModal}
    createTrip={createTrip}
    setOwnerName = {setOwnerName}
    setOwnerEmail = {setOwnerEmail}
    />
     )}
  </div>
  )
}