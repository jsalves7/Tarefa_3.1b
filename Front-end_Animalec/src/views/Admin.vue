<template>
  <section class="page-section">
    <b-container fluid>
      <HeaderPage title="Gestão do Animalec"/>

      <b-row>
        <b-col cols="4"></b-col>
        <b-col cols="4">
          <b-card-group deck>
            <AdminOptionBox routeName="listUsers" iconName="users" title="Utilizadores"/>
            <AdminOptionBox routeName="listAnimals" iconName="dog"  title="Animais"/>
          </b-card-group>
          <b-card-group deck class="mt-3">
            <AdminOptionBox routeName="listQuizzes" iconName="file-alt"  title="Quizzes"/>
            <AdminOptionBox routeName="listQuestions" iconName="question-circle"  title="Questões"/>
          </b-card-group>
          <b-card-group deck class="mt-3">
            <AdminOptionBox routeName="listSponsors" iconName="hand-holding-heart"  title="Patrocinadores"/>
            <AdminOptionBox routeName="listExperts" iconName="user-graduate"  title="Especialistas"/>
          </b-card-group>
          <nav aria-label="Protótipos HTML5" class="mt-4 text-center">
            <a
              href="/prototipos/sponsors.html"
              target="_blank"
              rel="noopener"
              class="btn btn-outline-info mr-2"
            >Protótipo de patrocinadores</a>
            <a
              href="/prototipos/experts.html"
              target="_blank"
              rel="noopener"
              class="btn btn-outline-info"
            >Protótipo de especialistas</a>
          </nav>
        </b-col>
        <b-col cols="4"></b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script>
import HeaderPage from "@/components/HeaderPage.vue";
import AdminOptionBox from "@/components/AdminOptionBox.vue";

export default {
  components: {
    HeaderPage,
    AdminOptionBox
  }
};
</script>