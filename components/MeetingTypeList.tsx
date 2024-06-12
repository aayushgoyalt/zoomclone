'use client'
import React from 'react'
import Image from 'next/image';
import HomeCard from './HomeCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { Call } from '@stream-io/node-sdk';
import { useToast } from "@/components/ui/use-toast"

const MeetingTypeList = () => {
  const router =  useRouter();
  const [meetingState, setmeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
  const {user}=useUser();
  const client=useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
})

const [callDetails, setCallDetails] = useState<Call>();
const { toast } = useToast();
  
  const CreateMeeting = async () =>{
    if(!client || !user) return;

    try {
      if(!values.dateTime)  {toast({
        title: "Please select a date and time",
      });
      return;}
      const id = crypto.randomUUID();
      const call = client.call('default',id);

      if(!call) throw new Error('failed Call found');

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || '';
      const link = values.link || '';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          }
        }
      })      

      setCallDetails(call);
      if(!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({
        title: "Meeting created",
      })
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to Creaete Meeting",
      });
    }
    
  }


  
  return (
    <section className=' grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard
      img='/icons/add-meeting.svg'
      title='New Meeting'
      description= 'Start an instant meeting'
      handleClick = {() => setmeetingState('isInstantMeeting')}
      className='bg-orange-500'
       />
      <HomeCard 
      img='/icons/schedule.svg'
      title='Schedule Meeting'
      description= 'Schedule a meeting for later'
      handleClick = {() => setmeetingState('isScheduleMeeting')}
      className='bg-blue-500'
      />
      <HomeCard 
      img='/icons/recordings.svg'
      title='View Recordings'
      description= 'check your past recordings'
      handleClick = {() => router.push('/recordings')}
      className='bg-purple-500'
      />

      <HomeCard 
      img='/icons/join-meeting.svg'
      title='Join Meeting'
      description= 'via invitation link'
      handleClick = {() => setmeetingState('isJoiningMeeting')}
      className='bg-yellow-500'
      />

      {!callDetails?(
        <MeetingModal
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setmeetingState(undefined)}
        title='Create Meeting'
        handleClick ={CreateMeeting}
      />
      ): (
        <MeetingModal
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setmeetingState(undefined)}
        title='meeting created'
        handleClick ={() => {
          // navigator.clipboard.writeText(MeetingLink);
          // toast({title: link copied to clipboard})
        }}
        image='/icons/checked.svg'
        buttonIcon='/icons/copy.svg'
        buttonText='copy meeting link'
        />
      )}
      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setmeetingState(undefined)}
        title='Start an instant meeting'
        buttonText="start Meeting"
        className = 'text-center'
        handleClick ={CreateMeeting}
      />

    </section>
  )
}

export default MeetingTypeList